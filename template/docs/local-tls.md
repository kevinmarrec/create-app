# **Local TLS Setup Guide**

This guide provides the essential steps to install mkcert and generate trusted TLS certificates for your Traefik-secured local development environment.

Certificates are expected in `.docker/traefik/certs/`.

## **1. Install mkcert (Ubuntu/WSL)**

Download, install, and clean up the executable:

```sh
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
rm mkcert-v*-linux-amd64
```

Verify the installation:

```sh
mkcert -version
```

## **2. Install the mkcert Root CA**

Install the local root CA to trust generated certificates:

```sh
mkcert -install
```

### **Firefox and Zen Browser (Manual Import)**

Browsers like Firefox and Firefox-based Zen Browser require manual import into their internal trust stores.

1. **Find Root CA File Path:**
   Run the appropriate command below to get the full path to the rootCA.pem file:
   - **Linux Native (or WSL for Linux Apps):**

     ```sh
     echo "$(mkcert -CAROOT)/rootCA.pem"
     # /home/user/.local/share/mkcert/rootCA.pem
     ```

   - **WSL for Windows Host Applications:** Use wslpath to get the Windows-formatted path.
     ```sh
     wslpath -w "$(mkcert -CAROOT)/rootCA.pem"
     # \\wsl.localhost\Ubuntu\home\user\local\share\mkcert\rootCA.pem
     ```

2. **Import:** In the browser's settings:
   - **Settings** -> **Privacy & Security**.
   - **Certificates** -> **View Certificates...**
   - **Authorities** tab -> **Import...**
   - Select the rootCA.pem file (using the path found above).
   - Check **"Trust this CA to identify websites"**.

## **3. Generate the `dev.localhost` Certificate**

Generate the wildcard certificate for `*.dev.localhost` and place the files where Traefik is configured to look.

1. **Create Directory:**

   ```sh
   mkdir -p .docker/traefik/certs
   ```

2. **Generate Certificate:**
   ```sh
   mkcert \
     -cert-file .docker/traefik/certs/dev.localhost.crt \
     -key-file .docker/traefik/certs/dev.localhost.key \
     "dev.localhost" "*.dev.localhost"
   ```

## **4. Validate Setup**

Run Docker Compose to start the services:

```sh
docker compose up -d
```

Check **https://traefik.dev.localhost** and **https://app.dev.localhost** in your browser.

You should see the Traefik dashboard and the app running.

## **5. Clean Up**

Stop and remove the services:

```sh
docker compose down
```

Remove the certificates:

```sh
rm -rf .docker/traefik/certs
```
