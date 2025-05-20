// Function to generate a strong random password
export function generateStrongPassword(length = 10) {
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ" // Removed confusing characters like I and O
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz" // Removed confusing characters like l
    const numberChars = "23456789" // Removed confusing characters like 0 and 1
    const specialChars = "!@#$%^&*_-+="
  
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars
  
    // Ensure at least one character from each category
    let password = ""
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length))
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length))
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))
  
    // Fill the rest of the password
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }
  
    // Shuffle the password characters
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("")
  }
  
  // Function to extract name from email
  export function extractNameFromEmail(email) {
    if (!email) return "User"
  
    // Get the part before @ symbol
    const namePart = email.split("@")[0]
  
    // Replace dots, underscores, etc. with spaces
    const nameWithSpaces = namePart.replace(/[._-]/g, " ")
  
    // Capitalize each word
    const capitalizedName = nameWithSpaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  
    return capitalizedName || "User"
  }
  