"use client";
import React, { use, useEffect, useState } from 'react';
import { useForm ,Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Image from 'next/image';
import { updateImage, updateProfile } from '@/lib/reducers/userReducer';

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required').matches(/^[a-zA-Z ]{2,}$/, 'Invalid name format'),
  phone: yup.string().required('Phone number is required').matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  image: yup.mixed().required('Image is required'),
});
const ProfileForm = () => {
  const dispatch = useDispatch();
  const {user,updateprofileloading,savechangeloading} = useSelector((state) => state.user);
  const { register, handleSubmit, control, formState: { errors },setValue } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [view, setView] = useState(false);
  const onSubmit = (data) => {
    dispatch(updateProfile({ name: data.name, phone: data.phone }));
  };

  const onImageSubmit = (data) => {
    
    dispatch(updateImage(data.image));
  };
  const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };
  const handleImageChange = async(e) => {
        const file = e.target.files[0];
        if (file) {
          const previewUrl = await fileToBase64(file);
          setImagePreview(previewUrl);
          setValue("image",previewUrl);
          setView(true)
        }
      };

      useEffect(() => {
        setValue("name", user?.name);
        setValue("phone", user?.phone);
        setValue("image",user?.image);
        setImagePreview(user?.image);
      }, [user]);


  return (
        <>
  

    
  
    <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 ">
       
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between mb-5 items-start">
                <h2 className="mb-5 text-4xl font-bold text-pink-900">Update Profile</h2>
                <form  className="text-center">
                    <div >
                        <Image src={imagePreview||"/images/user.svg"} alt="Profile Picture" width={100} height={100} className="rounded-full w-32 h-32 mx-auto border-4 border-indigo-800 mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300" />
                        <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <input
                    name="profile" id="upload_profile" hidden required 
                      type="file"
                      onChange={(e) => {
                        handleImageChange(e);
                        field.onChange(e.target.files);
                      }}
                    />
                  )}
                />
                        <label for="upload_profile" className="inline-flex items-center">
                            <svg data-slot="icon" className="w-5 h-5 text-blue-700" fill="none" stroke-width="1.5"
                                stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z">
                                </path>
                            </svg>
                        </label>
                    </div>
                   { view  ? <button className="bg-pink-800 text-white px-4 py-2 rounded-lg hover:bg-pink-900 transition-colors duration-300 ring ring-gray-300 hover:pink-300" onClick={handleSubmit(onImageSubmit)} disabled={savechangeloading}>
                     {savechangeloading ? "updating...":  "Update Profile Picture"}
                    </button>: ""}
                </form>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label for="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input  {...register('name')} type="text" id="name" className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${errors.name ? 'border-red-500' : 'border-gray-100'}`} />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
            
                
                <div>
                    <label for="phone"  className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" id="phone" {...register('phone')}  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${errors.phone ? 'border-red-500' : 'border-gray-100'}`}  />
                    {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                </div>
               
                <div class="flex justify-end space-x-4">
            
                    <button type="submit" disabled={updateprofileloading} className="px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-700">
                    {updateprofileloading ? "Saving...":  "Save Changes"}
                        </button>
                </div>
            </form>
        </div>
        <div>
                    <label for="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email"     
                value={user?.email}
                readOnly className="w-full px-3 py-2 border  rounded-md focus:ring-pink-500 focus:border-pink-500 border-gray-100" />
                </div>

    </div>

    </>
  );
};

export default ProfileForm;