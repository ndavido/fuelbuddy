<h1 align="center">
    <b>Collaborative Project</b>
</h1>
<p align="center">
  <img src="https://github.com/ndavido/fuelbuddy/raw/main/Frontend/assets/fuelbuddy_media/fuelbuddy_advert_gif_30fps.gif" alt="fuelbuddy gif">
</p>

## **Application Overview**

_**`Application for assisting in helping users plan journeys and track petrol/diesel usage.`**_

fuelbuddy is an app that allows users to budget their fuel expenditure and plan journeys as well as being able to check current user submitted fuel prices at Stations. fuelbuddy boasts many important features to be able to make drivers lives easier, such as The Receipt Scanner which allows users to update their budget, log the receipt, and update the price at the station all in one go! Or the Dashboard, which breaks down the current and past weekly budgets set by the user!

## **Setting up Frontend**

### - _Prerequisites_

> Before you begin, make sure you have the following installed:

#### - _Node.js:_

> Check your Node.js version with the following command:

```bash
node --version
```

#### - _Node Version Manager (nvm)_

> To manage Node.js versions, it's recommended to use Node Version Manager (nvm).

1. #### _For Windows_

   > NVM for Windows is a separate project from the original NVM and provides similar functionality. Here's how to install it:

   #### - _Download the Installer_

   > Visit the github releases page for NVM for Windows ([nvm-windows](https://github.com/coreybutler/nvm-windows/releases))

   > Download the latest release's `nvm-setup.zip` file.

   #### - _Run the Installer_

   > Extract the `nvm-setup.zip` file and run the `nvm-setup.exe` installer.

   > Follow the installation prompts. It's recommended to accept the default settings unless you have specific requirements.

   #### - _Verify Installation_

   > Open a new command prompt or PowerSheel window.

   > To ensure NVM was installed correctly, type in the following command:

   ```bash
   nvm version
   ```

2. #### _For Linux/macOS_

   The installation process for Linux and macOS uses a curl or wget command to download and run the installation script.

   #### - _Open Terminal_

   #### - _Download and Install NVM_

   > You can install NVM using either curl or wget. Only use one of the following commands:

   Using `curl`:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```

   Or using `wget`:

   ```bash
   wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```

---

#### - _Activate NVM_

To start using nvm immediately, you might need to source your `.bash_profile`, `.zshrc`, `.profile`, or `.bashrc`, depending on your shell. You can do this by running:

> For bash users:

```bash
source ~/.bashrc
```

> For zsh users

```bash
source ~/.zshrc
```

`Alternatively` Restart your terminal to apply the changes.

#### - _Install the Latest Node.js LTS Version_

> Install the latest Node.js LTS (Long-Term Support) version using nvm:

```bash
nvm install --lts
```

---

### - _Frontend Setup_

> Navigate to the Frontend folder in your terminal:

```bash
cd Frontend
```

> Install Axios, a popular HTTP client for making requests:

```bash
npm install axios
```

#### - _Expo CLI_

> To work with Expo, you need to install the Expo CLI. Use one of the following commands based on your operating system:

1. #### _On Windows_

   ```bash
   npm install -g expo-cli
   ```

2. #### _On Linux and macOS (requires sudo access)_
   ```bash
   sudo npm install -g expo-cli
   ```

> Make sure you are in the Frontend folder, and then start Expo:

```bash
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

   ```bash
   python -m pip install --upgrade pip
   ```

2. #### _For Linux/macOS_

   1. #### _Linux_

      > Most Linux distributions come with Python pre-installed. To check if Python is installed and determine its version, open a terminal and type:

      ```bash
      python --version
      ```

      > or, for Python 3.x:

      ```bash
      python3 --version
      ```

      #### - _Install Python_

      > If Python is not installed or you want to install a different version, you can use the package manager provided by your distribution. For example, on Ubuntu or Debian:

      ```bash
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

      ```bash
      python3 --version
      ```

      #### - _Update pip_

      > To update pip, the Python package installer, run the following command in the Terminal:

      ```bash
      python3 -m pip install --upgrade pip
      ```

### - _Backend Setup_

> Navigate to the Backend folder in your terminal:

```bash
cd Backend
```

#### - _Create a Virtual Environment_

> Run the following command to create a virtual environment:

1. #### _On Windows_

   ```bash
   python -m venv venv
   ```

2. #### _On Linux/macOS_

   ```bash
   python3 -m venv venv
   ```

#### - Activate the Virtual Environment

1. #### _On Windows (Powershell)_

   ```bash
   .\venv\Scripts\activate
   ```

2. #### _On Windows (Command Prompt)_

   ```bash
   .\venv\Scripts\activate.bat
   ```

3. #### _On Linux/macOS_
   ```bash
   source venv/bin/activate
   ```

#### - _Deactivating the Virtual Environment_

> When you're done working in the virtual environment and want to switch back to the global Python environment, you can deactivate it by running:

```bash
deactivate
```

#### - _Install Project Dependencies_

> Once you are inside the virtual environment, install the Python dependencies from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

### - _Launching the Backend_

> Once you're in the correct directory, you can run the script using the Python interpreter. If you're using Python 3 (which is recommended), you might need to use `python3` instead of `python`, depending on how Python is installed and configured on your system.

```bash
python app.py
```

> or, if you're using Python3 specifically:

```bash
python3 app.py
```

## _Setting up pytesseract_

> To use `pytesseract` in your project, you must install both the Tesseract-OCR engine and the Python wrapper package. Follow these steps to set up everything correctly:

### _Step 1: Install Tesseract-OCR_

> Tesseract-OCR must be installed on your local machine. The installation process varies depending on your operating system:

#### _For Windows:_

> 1. Download the installer from the official Tesseract at UB Mannheim repository: [Tesseract at UB Mannheim](https://github.com/UB-Mannheim/tesseract/wiki).
> 2. Run the installer and follow the prompts. Make sure to note the installation path (e.g., `C:\Program Files\Tesseract-OCR`).
> 3. Add Tesseract’s installation path to your system’s PATH environment variable.

#### _For macOS:_

> Use Homebrew to install Tesseract:

```bash
brew install tesseract
```

#### _For Linux:_

> Install Tesseract using the package manager. For example, on Ubuntu:

```bash
sudo apt install tesseract-ocr
```

### _Step 2: Install pytesseract Python package_

> Once Tesseract-OCR is installed, you can install the pytesseract Python package via pip:

```bash
pip install pytesseract
```

### _Step 3: Configure pytesseract in your Python script_

> Modify your Python code to specify the path to the Tesseract executable by uncommenting the line corresponding to your operating system. You will find these lines in the file located at `Backend/src/utils/ocr_utils.py`. Here's what you should look for:

#### _For Windows, uncomment the following line:_

```bash
#pytesseract.pytesseract.tesseract_cmd = "C:/Program Files/Tesseract-OCR/tesseract.exe"
```

#### _For Linux, uncomment the following line:_

```bash
#pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'
```

#### _For macOS, uncomment the following line:_

```bash
#pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
```

> Make sure to save the changes after uncommenting the appropriate line. This configuration ensures that `pytesseract` can correctly interface with the Tesseract engine installed on your machine to perform OCR tasks.
