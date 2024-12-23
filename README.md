
# Cloud-linker

## **Project Summary**
The Cloud-linker is a React.js web application designed to help citizens securely store, manage, and share their important documents digitally. By linking documents to user's account, the system minimizes the risk of document loss, reduces government overhead costs, and provides centralized access to services across various categories like education, healthcare, and railways. Firebase serves as the backend, ensuring efficient data handling and real-time updates.

---

## **Website Features**

### **User Features**
1. **User Registration and Login**
   - Secure user authentication using Firebase.
   - Email and password-based registration and login.

2. **Upload Document**
   - Users can upload digital versions of their documents (e.g., mark sheets, PAN cards, passports).
   - Documents are linked to the user's account for easy identification.

3. **Update/Delete Document**
   - Users can update document details or replace outdated documents.
   - Option to permanently delete a document.

4. **Share Document**
   - Users can securely share documents with the share button provided in the option of the document.

5. **My Profile**
   - Users can view and update their profile information.

6. **View Document**
   - Easily access a list of uploaded documents.
   - Preview documents within the application.

---

## **How the System Works**

### **1. Uploading Documents**
- Users can navigate to the "Upload Document" section.
- Select a file from their local storage.
- The document is uploaded to Firebase Realtime Database, which securely stores the document.

### **2. Storing Documents**
- Documents are stored in Firebase Realtime Database.
- Documents are linked to the user's cloud-linker account for added security and easy identification.

### **3. Sharing Documents**
- Users can share a document by the share button available on the options menu.


### **4. Accessing Documents**
- Documents can be accessed easily after logging into the account.
- Users can filter and search documents by name.
- Documents can be previewed, downloaded, or shared directly from the application.

---

## **Technical Highlights**
- **Frontend:** React.js for a responsive and user-friendly interface.
- **Backend:** Firebase Realtime Database for secure document storage and real-time updates.
- **Authentication:** Firebase Authentication for secure user login and registration.
- **Storage:** Documents stored as base64-encoded strings in the Firebase Realtime Database.

---

## **Usage Instructions**

### For Users:
1. **Sign Up/Login**
   - Create an account or log in using existing credentials.

2. **Upload Documents**
   - Navigate to the "Upload Document" section.
   - Select a file.
   - Click "Upload" to store the document.

3. **View and Manage Documents**
   - Access the uploaded documents in the account and can favourite documents for accessing them separately.
   - Edit or delete documents as needed.

4. **Share Documents**
   - Document can be shared by email or any digital way or can be downloaded.

5. **Update Profile**
   - Go to the "My Profile" section to update personal details.

---

## **Future Enhancements**
- Integration with government and private sector APIs for automated document verification.
- AI-based categorization of uploaded documents.
- Support for multi-language user interfaces.
- Offline access using Progressive Web App (PWA) technology.

---

This project aims to revolutionize document management for citizens, providing a secure, centralized, and convenient way to handle important documents digitally.
