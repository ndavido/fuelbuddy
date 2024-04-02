<h1 align="center">
    <b>Collaborative Project</b>
</h1>
<p align="center">
  <img src="https://github.com/ndavido/fuelbuddy/raw/main/Frontend/assets/fuelbuddy_media/fuelbuddy_advert_to_gif.gif" alt="fuelbuddy gif">
</p>

## **Application Overview**

_**`Application for assisting in helping users plan journeys and track petrol/diesel usage.`**_

The "fuelbuddy" application enables users to manage their fuel expenses. Fuelbuddy operates on a user-driven approach, where all data is sourced directly from the users. As a result, the information given in the application, such as gasoline prices, will be gathered from users. Fuelbuddy will provide distinctive functionalities that enable users to effectively manage their fuel expenditures. One of the capabilities is a neural network that predicts the user's anticipated fuel expenses for the upcoming week or month. Additionally, it will have functionalities such as a navigation tool that enables users traveling on lengthy trips to identify different gas stations along their route in order to choose the most cost-effective option. Fuelbuddy will cater to both conventional gasoline and diesel automobiles as well as electric vehicles. Electric car users will have the capability to easily find and navigate to charging stations in their vicinity, similar to users of petrol and diesel vehicles. fuelbuddy will further present diverse details on the user's automobile type by enabling them to input the precise model of their vehicle.

## **Setting up Frontend**

### - _Prerequisites_

Before you begin, make sure you have the following installed:

#### - _Node.js:_

> Check your Node.js version with the following command:

```
node --version
```

#### - _Node Version Manager (nvm)_

> To manage Node.js versions, it's recommended to use Node Version Manager (nvm).

1. #### _For Windows_

   NVM for Windows is a separate project from the original NVM and provides similar functionality. Here's how to install it:

   #### - _Download the Installer_

   > Visit the github releases page for NVM for Windows ([nvm-windows](https://github.com/coreybutler/nvm-windows/releases))

   > Download the latest release's `nvm-setup.zip` file.

   #### - _Run the Installer_

   > Extract the `nvm-setup.zip` file and run the `nvm-setup.exe` installer.

   > Follow the installation prompts. It's recommended to accept the default settings unless you have specific requirements.

   #### - _Verify Installation_

   > Open a new command prompt or PowerSheel window.

   > To ensure NVM was installed correctly, type in the following command:

   ```
   nvm version
   ```

2. #### _For Linux/macOS_

   The installation process for Linux and macOS uses a curl or wget command to download and run the installation script.

   #### - _Open Terminal_

   #### - _Download and Install NVM_

   > You can install NVM using either curl or wget. Only use one of the following commands:

   Using `curl`:

   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```

   Or using `wget`:

   ```
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```

---

#### - _Activate NVM_

To start using nvm immediately, you might need to source your `.bash_profile`, `.zshrc`, `.profile`, or `.bashrc`, depending on your shell. You can do this by running:

> For bash users:

```
source ~/.bashrc
```

> For zsh users

```
source ~/.zshrc
```

`Alternatively` Restart your terminal to apply the changes.

#### - _Install the Latest Node.js LTS Version_

> Install the latest Node.js LTS (Long-Term Support) version using nvm:

```
nvm install --lts
```

---

### - _Frontend Setup_

> Navigate to the Frontend folder in your terminal:

```
cd Frontend
```

> Install Axios, a popular HTTP client for making requests:

```
npm install axios
```

#### - _Expo CLI_

> To work with Expo, you need to install the Expo CLI. Use one of the following commands based on your operating system:

1. #### _On Windows_

   ```
   npm install -g expo-cli
   ```

2. #### _On Linux and macOS (requires sudo access)_
   ```
   sudo npm install -g expo-cli
   ```

> Make sure you are in the Frontend folder, and then start Expo:

```
expo start
```

---

## _Setting up Backend_

### - _Prerequisites_

#### - _Install Python_

Installing Python on your system varies slightly between Windows and Unix-like operating systems (Linux/macOS). Below are the steps for each:

1. #### _For Windows_

   #### - _Download Python_

   > Visit the official Python website's download page at [python.org](python.org).

   > Click on the **"Download Python"** button. The website should automatically offer the latest version for Windows.

   #### - _Run the Installer_

   > Open the downloaded `.exe` file to start the installation.

   > **Important**: Ensure to check the box that says "**Add Python X.X to PATH**" before clicking "**Install Now**", where X.X refers to the version number. This step is crucial for making Python accessible from the Command Prompt.

   #### - _Verify Installation_

   > Open Command Prompt and type `python --version` or `python -V` to verify that Python is installed correctly. You should see the Python version number if the installation was successful.

   #### - _Update pip_

   > After installing Python, it's a good idea to update `pip`, Python's package installer. In the Command Prompt, type:

   ```
   python -m pip install --upgrade pip
   ```

2. #### _For Linux/macOS_

   1. #### _Linux_

      > Most Linux distributions come with Python pre-installed. To check if Python is installed and determine its version, open a terminal and type:

      ```
      python --version
      ```

      > or, for Python 3.x:

      ```
      python3 --version
      ```

      #### - _Install Python_

      > If Python is not installed or you want to install a different version, you can use the package manager provided by your distribution. For example, on Ubuntu or Debian:

      ```
      sudo apt update
      sudo apt install python3
      ```

   2. #### _macOS_

      #### - _Download Python_

      > Go to [python.org](python.org) and download the latest version for macOS. The website should automatically detect your operating system and offer the correct version.

      #### - _Run the Installer_

      > Open the downloaded `.pkg` file to start the installation process. Follow the installation prompts to install Python on your system.

      #### - _Verify Installation_

      > Open Terminal and type the following command to verify the installation. You should see the version of Python that was installed.

      ```
      python3 --version
      ```

      #### - _Update pip_

      > To update pip, the Python package installer, run the following command in the Terminal:

      ```
      python3 -m pip install --upgrade pip
      ```

### - _Backend Setup_

> Navigate to the Backend folder in your terminal:

```
cd Backend
```

#### - _Create a Virtual Environment_

> Run the following command to create a virtual environment:

1. #### _On Windows_

   ```
   python -m venv venv
   ```

2. #### _On Linux/macOS_

   ```
   python -m venv envname
   ```

#### - Activate the Virtual Environment

1. #### _On Windows (Powershell)_

   ```
   .\venv\Scripts\activate
   ```

2. #### _On Windows (Command Prompt)_

   ```
   envname\Scripts\activate.bat
   ```

3. #### _On Linux/macOS_
   ```
   source venv/bin/activate
   ```

#### - _Deactivating the Virtual Environment_

> When you're done working in the virtual environment and want to switch back to the global Python environment, you can deactivate it by running:

```
deactivate
```

#### - _Install Project Dependencies_

> Once you are inside the virtual environment, install the Python dependencies from the `requirements.txt` file:

```
pip install -r requirements.txt
```

### - _Launching the Backend_

> Once you're in the correct directory, you can run the script using the Python interpreter. If you're using Python 3 (which is recommended), you might need to use `python3` instead of `python`, depending on how Python is installed and configured on your system.

```
python __init__.py
```

> or, if you're using Python3 specifically:

```
python3 __init__.py
```
