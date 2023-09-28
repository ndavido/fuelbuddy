
# Leafit

## Setting up Frontend

### Prerequisites

Before you begin, make sure you have the following installed:

#### - Node.js: 
> Check your Node.js version with the following command:
```
node --version
```
#### - Node Version Manager (nvm)
>To manage Node.js versions, it's recommended to use Node Version Manager (nvm).
>  Follow these steps to install it:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
> Restart your terminal to apply the changes.
#### - Install the Latest Node.js LTS Version
> - Now, install the latest Node.js LTS (Long-Term Support) version using nvm:
```
nvm install --lts
```
#### - Frontend Setup
> Navigate to the Frontend folder:
```
cd Frontend
``` 
> Install Axios, a popular HTTP client for making requests:
```
npm install axios
``` 
### Expo CLI
>To work with Expo, you need to install the Expo CLI. Use one of the following commands based on your operating system:
> ##### On Windows: 
```
npm install -g expo-cli
``` 
>##### On macOS and Linux (requires sudo access):
```
sudo npm install -g expo-cli
```
> Make sure you are in the Frontend folder, and then start Expo:
```
expo start
```
## Setting up Backend
### - Backend Folder
> Navigate to the Backend folder in your terminal:
```
cd Backend
```
### - Virtual Environment (venv)
> Activate the virtual environment:
> ##### On Windows (Powershell):
```
.\venv\Scripts\activate
```
>##### On macOS and Linux:
```
source venv/bin/activate
```
> Once you are inside the virtual environment, install the Python dependencies from the `requirements.txt` file:
```
pip install -r requirements.txt
```
### - Launching the Backend
> After installing the requirements, you can launch the backend by running the following command:
```
python app.py
```
