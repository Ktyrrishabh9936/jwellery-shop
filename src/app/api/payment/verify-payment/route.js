import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Order from '@/models/orderModel';
import Cart from '@/models/cartModel';
import { UserAuth } from '@/utils/userAuth';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { createShiprocketOrder } from '@/utils/shipRocket';
import moment from 'moment';
import couponModel from '@/models/couponModel';
import { sendEmail } from '@/utils/sendMail';
export const generateOrderId = (length = 10) => {
  const timestamp = Date.now().toString(); // Current timestamp
  const randomDigits = Math.floor(Math.random() * Math.pow(10, length - timestamp.length))
    .toString()
    .padStart(length - timestamp.length, "0"); // Generate random digits to fill length
  return `${timestamp}${randomDigits}`.slice(0, length );
};
export async function POST(req) {
  await connect();
  try {
    const {userId,paymentId, address, amount, orderId, signature,Items, couponCode} = await req.json();
    
    const secret = process.env.RAZORPAY_SECRET; // Use environment variables for sensitive data
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');
    if (digest === signature) {
      let Id;
      if(!userId) {
       Id = await UserAuth();
    }else{
      Id = userId;
    }
      const user = await User.findById(Id);
      if (!user) {
        return NextResponse.json({ message: 'Invaild user' }, { status: 404 });
      }
     
    let order = await Order.findOne({ userId:Id });
    if (!order) {
      order = new Order({ userId:Id, orders: [] });
    }
    let order_items = [];
    let orderTemplate = '';
    const items = Items.map((item) => 
      {
        orderTemplate += `<table class="t79" role="presentation" cellpadding="0" cellspacing="0" align="left" valign="middle">
        <tr class="t78"><td></td><td class="t64" width="99.09324" valign="middle">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t63" style="width:100%;"><tr><td class="t60" style="width:10px;" width="10"></td><td class="t61"><div style="font-size:0px;"><img class="t59" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="105" height="105" alt="" src="${item.img_src}"/></div></td><td class="t62" style="width:10px;" width="10"></td></tr></table>
        </td><td class="t70" width="256.09923" valign="middle">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t69" style="width:100%;"><tr><td class="t66" style="width:10px;" width="10"></td><td class="t67" style="padding:0 0 0 24px;"><h1 class="t65" style="font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:16px;font-weight:700;font-style:normal;font-size:14px;text-decoration:none;text-transform:uppercase;direction:ltr;color:#1A1A1A;text-align:left;mso-text-raise:1px;">${item.name}</h1></td><td class="t68" style="width:10px;" width="10"></td></tr></table>
        </td><td class="t77" width="164.80753" valign="middle">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t76" style="width:100%;"><tr><td class="t73" style="width:10px;" width="10"></td><td class="t74"><p class="t72" style="font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:500;font-style:normal;font-size:14px;text-decoration:none;text-transform:uppercase;letter-spacing:-0.56px;direction:ltr;color:#333333;text-align:right;">Quantity:<span class="t71" style="font-weight:bold;">${item.quantity}</span></p></td><td class="t75" style="width:10px;" width="10"></td></tr></table>
        </td>
        <td></td></tr>
        </table>`
        order_items.push(  {
          name: item.name,
          sku:  item.SKU,
          units: item.quantity || 1,
          selling_price: item.discountedPrice,
        })
        return {
        productId: item.productId,
        quantity: item.quantity|| 1,
        price:item.discountedPrice
      }})

       const JENII_ORDERID = generateOrderId()
            const shiprocket = await createShiprocketOrder({
              order_id: JENII_ORDERID,
              order_date: moment().format("YYYY-MM-DD HH:mm"),
              pickup_location: "Primary",
              billing_address: address.addressline1,
              billing_address_2:address.addressline2,
              billing_pincode: address.postalCode,
              billing_isd_code:address.countryCode,
              billing_city: address.city.label,
              billing_state: address.state.label,
              billing_country:address.country.value,
              billing_email: user.email,
              billing_phone: address.contact,
              billing_customer_name: address.firstName,
              billing_last_name: address.lastName,
              shipping_is_billing: true,
              order_items,
              payment_method: "Prepaid",
              sub_total: amount,
              length: 10,
              breadth: 10,
              height: 10,
              weight: 0.5,
            });
      
            if(!shiprocket){
              return NextResponse.json({
                message: "Something went wrong with shiprocket "
            }, { status: 403 });
            }
      
    
    order.orders.push({
      items ,
      payment:{
        mode:"Prepaid",
        paymentId:paymentId,
        signature:signature,
        orderId:orderId,
      },
      customer:{
        name:`${address.firstName} ${address.lastName}`,
        email:user.email,
        contact:address.countryCode+address.contact,
        address:`${address.addressline1} ${address.addressline2} `,
        city:address.city.label,
        state:address.state.label,
        country:address.country.label,
        pincode:address.postalCode
      },
      orderStatus: "CONFIRMED",
      amount,
      orderID:JENII_ORDERID,
      shipping:{
        shipmentID:shiprocket.shipment_id,
        shippingOrderId:shiprocket.order_id
      }
    });
    if(couponCode){
      const coupon = await couponModel.findOne({ code: couponCode });
      if(coupon){
        coupon.usedCount++;
        await coupon.save()
      }
    }
    await order.save();
    // const mail = await sendEmail(user.email, `JENII- Your Order is Successful - ${JENII_ORDERID}`, `
    //   <html >
    //   <head>
      
    //   <style type="text/css">
    //   table {
    //   border-collapse: separate;
    //   table-layout: fixed;
    //   mso-table-lspace: 0pt;
    //   mso-table-rspace: 0pt
    //   }
    //   table td {
    //   border-collapse: collapse
    //   }
    //   .ExternalClass {
    //   width: 100%
    //   }
    //   .ExternalClass,
    //   .ExternalClass p,
    //   .ExternalClass span,
    //   .ExternalClass font,
    //   .ExternalClass td,
    //   .ExternalClass div {
    //   line-height: 100%
    //   }
    //   body, a, li, p, h1, h2, h3 {
    //   -ms-text-size-adjust: 100%;
    //   -webkit-text-size-adjust: 100%;
    //   }
    //   html {
    //   -webkit-text-size-adjust: none !important
    //   }
    //   body, #innerTable {
    //   -webkit-font-smoothing: antialiased;
    //   -moz-osx-font-smoothing: grayscale
    //   }
    //   #innerTable img+div {
    //   display: none;
    //   display: none !important
    //   }
    //   img {
    //   Margin: 0;
    //   padding: 0;
    //   -ms-interpolation-mode: bicubic
    //   }
    //   h1, h2, h3, p, a {
    //   line-height: inherit;
    //   overflow-wrap: normal;
    //   white-space: normal;
    //   word-break: break-word
    //   }
    //   a {
    //   text-decoration: none
    //   }
    //   h1, h2, h3, p {
    //   min-width: 100%!important;
    //   width: 100%!important;
    //   max-width: 100%!important;
    //   display: inline-block!important;
    //   border: 0;
    //   padding: 0;
    //   margin: 0
    //   }
    //   a[x-apple-data-detectors] {
    //   color: inherit !important;
    //   text-decoration: none !important;
    //   font-size: inherit !important;
    //   font-family: inherit !important;
    //   font-weight: inherit !important;
    //   line-height: inherit !important
    //   }
    //   .smlr1{line-height:22px;font-weight:500;font-style:normal;font-size:14px;text-decoration:none;text-transform:none;letter-spacing:-0.56px;direction:ltr;color:#333333;text-align:left;}
    //   u + #body a {
    //   color: inherit;
    //   text-decoration: none;
    //   font-size: inherit;
    //   font-family: inherit;
    //   font-weight: inherit;
    //   line-height: inherit;
    //   }
    //   a[href^="mailto"],
    //   a[href^="tel"],
    //   a[href^="sms"] {
    //   color: inherit;
    //   text-decoration: none
    //   }
    //   </style>
    //   <style type="text/css">
    //   @media (min-width: 481px) {
    //   .hd { display: none!important }
    //   }
    //   </style>
    //   <style type="text/css">
    //   @media (max-width: 480px) {
    //   .hm { display: none!important }
    //   }
    //   </style>
    //   <style type="text/css">
    //   @media (max-width: 480px) {
             
    //   .t98{mso-line-height-alt:0px!important;line-height:0!important;display:none!important}.t99{padding-left:30px!important;padding-bottom:40px!important;padding-right:30px!important}.t101,.t161{width:480px!important}.t96{width:353px!important}.t6{padding-bottom:20px!important}.t106,.t13,.t144,.t149,.t157,.t19,.t24,.t30,.t35,.t41,.t46,.t51,.t56,.t8,.t84,.t90{width:420px!important}.t5{line-height:28px!important;font-size:26px!important;letter-spacing:-1.04px!important}.t159{padding:40px 30px!important}.t142{padding-bottom:36px!important}.t138{text-align:center!important}.t109,.t111,.t115,.t117,.t121,.t123,.t127,.t129,.t133,.t135,.t60,.t62,.t66,.t68,.t73,.t75{display:revert!important}.t113,.t119,.t125,.t131,.t137{vertical-align:top!important;width:44px!important}.t64,.t70,.t77{vertical-align:middle!important}.t1{padding-bottom:50px!important}.t3{width:80px!important}.t78{text-align:left!important}.t70{width:620px!important}.t67{padding-left:0!important}.t77{width:388px!important}.t64{width:221px!important}
    //   }
    //   </style>
    //   <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;700;800&amp;display=swap" rel="stylesheet" type="text/css" />
      
    //   </head>
    //   <body id="body" class="t165 " style="min-width:100%;Margin:0px;padding:0px;background-color:#242424;font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;"><div class="t164" style="background-color:#242424;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t163" style="font-size:0;line-height:0;background-color:#242424;" valign="top" align="center">
      
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td><div class="t98" style="mso-line-height-alt:45px;line-height:45px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
    //   <table class="t102" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
      
    //   <td class="t101" style="background-color:#F8F8F8;width:600px;">
    //   <table class="t100" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t99" style="padding:0 50px 60px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="left">
    //   <table class="t4" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;"><tr>
    //   <img src="https://img.mailinblue.com/8812198/images/content_library/original/67bb45f0b92c6ab342489ca4.png" width="324" border="0" style="display: block; width: 50%; margin-left: auto;margin-right: auto;">
    //   </tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t9" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
      
    //   <td class="t8" style="width:500px;">
    //   <table class="t7" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t6" style="padding:0 0 15px 0;"><h1 class="t5" style="font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:26px;font-weight:800;font-style:normal;font-size:24px;text-decoration:none;text-transform:none;letter-spacing:-1.56px;direction:ltr;color:#191919;text-align:left;mso-text-raise:1px;">${address.firstName} ${address.lastName}, Thank you for your order.</h1></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t14" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto; margin-bottom: 10px;"><tr>
      
    //   <td class="t13" style="width:500px;">
    //   <table class="t12" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t11 smlr1" >Your order is being processed by Jenii Team. You will receive an update from us regarding the status of your order and the delivery of the parcel.</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t20" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t19" style="width:500px;">
    //   <table class="t18" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t17"><p class="t16 smlr1" ><span class="t15" style="font-weight:bold;">Ordernumber</span></p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t25 " role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t24" style="width:500px;">
    //   <table class="t23" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t22" style="padding:0 0 22px 0;"><p class="t21 smlr1" >${JENII_ORDERID}</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t31" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;">
    //   <td class="t41" style="width:500px;">
    //   <table class="t40" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t39"><p class="t38 smlr1" ><span class="t37" style="font-weight:bold;">Delivery address</span></p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t47" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t46" style="width:500px;">
    //   <table class="t45" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t44"><p class="t43 smlr1" >${address.addressline1} ${address.addressline2}  </p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t52" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t51" style="width:500px;">
    //   <table class="t50 smlr1" role="presentation" cellpadding="0" cellspacing="0" width="100%" >${address.city['label']} ${address.state['label']} ${address.postalCode}</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t57" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t56" style="width:500px;">
    //   <table class="t55 smlr1" role="presentation" cellpadding="0" cellspacing="0" width="100%" >${address.country['label']}</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td><div class="t58" style="line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
    //   <table class="t85" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t84" style="background-color:#FFFFFF;width:500px;">
    //   <table class="t83" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t82" style="padding:20px 20px 20px 20px;"><div class="t81" style="width:100%;text-align:left;"><div class="t80" style="display:inline-block;">${orderTemplate}</div></div></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td><div class="t86" style="line-height:30px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="center">
      
    //   </td></tr><tr><td><div class="t92" style="mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td align="left">
      
    //   </td></tr></table></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t162" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t161" style="background-color:#F8C0BF;width:600px;">
    //   <table class="t160" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t159" style="padding:48px 50px 48px 50px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td align="center">
    //   <table class="t107" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t106" style="width:500px;">
    //   <table class="t105" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t104"><p class="t103" style="font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:800;font-style:normal;font-size:18px;text-decoration:none;text-transform:none;letter-spacing:-0.9px;direction:ltr;color:#424242;text-align:center;mso-text-raise:1px;">Want updates through more platforms?</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t145" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t144" style="width:500px;">
    //   <table class="t143" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t142" style="padding:10px 0 44px 0;"><div class="t141" style="width:100%;text-align:center;"><div class="t140" style="display:inline-block;"><table class="t139" role="presentation" cellpadding="0" cellspacing="0" align="center" valign="top">
    //   <tr class="t138"><td></td><td class="t113" width="44" valign="top">
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t112" style="width:100%;"><tr><td class="t109" style="width:10px;" width="10"></td><td class="t110"><div style="font-size:0px;"><img class="t108" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://76cbf3d4-4d58-499c-a26d-ea2052d0fda0.b-cdn.net/e/cb870b1c-84e0-4d09-9943-9b2ad9d1487c/9a9cd805-6430-4da3-8baa-c5d6032348d7.png"/></div></td><td class="t111" style="width:10px;" width="10"></td></tr></table>
    //   </td><td class="t119" width="44" valign="top">
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t118" style="width:100%;"><tr><td class="t115" style="width:10px;" width="10"></td><td class="t116"><div style="font-size:0px;"><img class="t114" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://76cbf3d4-4d58-499c-a26d-ea2052d0fda0.b-cdn.net/e/cb870b1c-84e0-4d09-9943-9b2ad9d1487c/b81fa84a-1d16-43c0-8bdf-120721add9e6.png"/></div></td><td class="t117" style="width:10px;" width="10"></td></tr></table>
    //   </td><td class="t125" width="44" valign="top">
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t124" style="width:100%;"><tr><td class="t121" style="width:10px;" width="10"></td><td class="t122"><div style="font-size:0px;"><img class="t120" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://76cbf3d4-4d58-499c-a26d-ea2052d0fda0.b-cdn.net/e/cb870b1c-84e0-4d09-9943-9b2ad9d1487c/17a7bee9-1812-4f4c-baeb-2e1f0a147086.png"/></div></td><td class="t123" style="width:10px;" width="10"></td></tr></table>
    //   </td><td class="t131" width="44" valign="top">
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t130" style="width:100%;"><tr><td class="t127" style="width:10px;" width="10"></td><td class="t128"><div style="font-size:0px;"><img class="t126" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://76cbf3d4-4d58-499c-a26d-ea2052d0fda0.b-cdn.net/e/cb870b1c-84e0-4d09-9943-9b2ad9d1487c/4f4c1801-69b8-4a08-bbba-b5f17f6fd273.png"/></div></td><td class="t129" style="width:10px;" width="10"></td></tr></table>
    //   </td><td class="t137" width="44" valign="top">
    //   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t136" style="width:100%;"><tr><td class="t133" style="width:10px;" width="10"></td><td class="t134"><div style="font-size:0px;"><img class="t132" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;" width="24" height="24" alt="" src="https://76cbf3d4-4d58-499c-a26d-ea2052d0fda0.b-cdn.net/e/cb870b1c-84e0-4d09-9943-9b2ad9d1487c/fe4b2f26-d46f-40e6-8d93-0a8dec5d78f6.png"/></div></td><td class="t135" style="width:10px;" width="10"></td></tr></table>
    //   </td>
    //   <td></td></tr>
    //   </table></div></div></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t150" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t149" style="width:500px;">
    //   <table class="t148" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t147"><p class="t146" style="font-family:Albert Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-weight:500;font-style:normal;font-size:12px;text-decoration:none;text-transform:none;direction:ltr;color:#424242;text-align:center;mso-text-raise:3px;">Broadway Empire, Nilamber Circle, Near Akshar
    //   Pavilion, Vasna Bhayli Main Road, Vadodara, Gujarat,
    //   391410</p></td></tr></table>
    //   </td></tr></table>
    //   </td></tr><tr><td align="center">
    //   <table class="t158" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr>
    //   <td class="t157" style="width:500px; ">
    //           <table cellspacing="0" cellpadding="0" border="0" role="presentation" width="100%" class="r12-o" style="table-layout: fixed; width: 100%; margin-top: 20px;"><tr><td align="center" valign="top" class="r13-i nl2go-default-textstyle" style="color: #3b3f44; font-family: arial,helvetica,sans-serif; font-size: 16px; line-height: 1.5; word-break: break-word; text-align: center; color: #424242;"> <div ><p style="margin: 0;"><strong>© 2025 Jenii. All rights reserved.</strong><br>www.jenii.in </p><p style="margin: 0;">📧 Need help? Contact us at info@jenii.in<br>Marketed by AREVEI</p></div> </td> </tr><tr class="nl2go-responsive-hide"><td height="15" style="font-size: 15px; line-height: 15px;">­</td> </tr></table></td> </tr></table>
    //   </td></tr></table>
    //   </td></tr></table></td></tr></table>
    //   </td></tr></table>
    //   </td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
    //   </html>
    //   `,process.env.BREVO_API_KEY);
    return NextResponse.json(order, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Error verifying payment' }, { status: 500 });
  }
}
