<h1 style="text-align:center">Fuelbuddy</h1>

<h2 style="text-align:center">Application Overview</h2>

__`Application for assisting in helping users plan journeys and track petrol/diesel usage.`__

The "fuelbuddy" application enables users to manage their fuel expenses. Fuelbuddy operates on a user-driven approach, where all data is sourced directly from the users. As a result, the information given in the application, such as gasoline prices, will be gathered from users. Fuelbuddy will provide distinctive functionalities that enable users to effectively manage their fuel expenditures. One of the capabilities is a neural network that predicts the user's anticipated fuel expenses for the upcoming week or month. Additionally, it will have functionalities such as a navigation tool that enables users traveling on lengthy trips to identify different gas stations along their route in order to choose the most cost-effective option. Fuelbuddy will cater to both conventional gasoline and diesel automobiles as well as electric vehicles. Electric car users will have the capability to easily find and navigate to charging stations in their vicinity, similar to users of petrol and diesel vehicles. fuelbuddy will further present diverse details on the user's automobile type by enabling them to input the precise model of their vehicle.

<h2 style="text-align:center">Table of Contents</h2>

1. Setting up Frontend
    * Prerequisites
        1. Node.js
        2. Node Version Manager (nvm)
            * Windows
            * Linux / macOS
        3. Latest Node.js LTS Version
    * Frontend Setup
        1. Install Axios
        2. Expo CLI



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

##### 1. For Windows
> NVM for Windows is a separate project from the original NVM and provides similar functionality. Here's how to install it:

###### Download the Installer
* Visit the github releases page for NVM for Windows ([nvm-windows](https://github.com/coreybutler/nvm-windows/releases))
* Download the latest release's `nvm-setup.zip` file.
###### Run the Installer
* Extract the `nvm-setup.zip` file and run the `nvm-setup.exe` installer.
* Follow the installation prompts. It's recommended to accept the default settings unless you have specific requirements.
###### Verify Installation
* Open a new command prompt or PowerSheel window.
* To ensure NVM was installed correctly, type in the following command:
```
nvm version
```
-----

##### 2. For Linux/macOS
> The installation process for Linux and macOS uses a curl or wget command to download and run the installation script.
###### Open Terminal
###### Download and Install NVM
* You can install NVM using either curl or wget. Only use one of the following commands:
    Using `curl`:
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```
    Or using `wget`:
    ```
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

    ```
###### Activate NVM
* To start using nvm immediately, you might need to source your `.bash_profile`, `.zshrc`, `.profile`, or `.bashrc`, depending on your shell. You can do this by running:
    For bash users:
    ```
    source ~/.bashrc
    ```
    For zsh users
    ```
    source ~/.zshrc
    ```
* Alternatively:
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
