Install Chrome
```
sudo apt-get -y update
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y
```

Fetch the web driver
```
chrome_version=($(google-chrome-stable --version))
chromedriver_version=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")
if [ "${chrome_version[2]}" == "$chromedriver_version" ]; then
    echo "Compatible Chromedriver is available..."
    echo "Proceeding with installation..."
else
    echo "Compabible Chromedriver not available...exiting"
    exit 1
fi
echo "Downloading latest Chromedriver..."
curl -Lo chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/${chromedriver_version}/chromedriver_linux64.zip"
echo "Unzip the binary file and make it executable..."
mkdir -p "chromedriver/stable"
unzip -q "chromedriver_linux64.zip" -d "chromedriver/stable"
chmod +x "chromedriver/stable/chromedriver"
```
