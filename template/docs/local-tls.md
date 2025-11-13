# **Local TLS Setup Guide**

This guide provides the essential steps to install mkcert and generate trusted TLS certificates for your Traefik-secured local development environment.

Certificates are expected in `.docker/traefik/certs/`.

## **Prerequisites**

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- Ports 80 and 443 available on your system
- Administrator/sudo access for installing mkcert

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
     # \\wsl.localhost\Ubuntu\home\user\.local\share\mkcert\rootCA.pem
     ```

2. **Import:** In the browser's settings:
   - **Settings** -> **Privacy & Security**.
   - **Certificates** -> **View Certificates...**
   - **Authorities** tab -> **Import...**
   - Select the rootCA.pem file (using the path found above)
   - Check **"Trust this CA to identify websites"**
   - Click **OK**

## **3. Generate the `dev.localhost` Certificate**

Generate the wildcard certificate for `*.dev.localhost` and place the files where Traefik is configured to look (See [`tls.yml`](../.docker/traefik/dynamic/tls.yml)).

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

3. **Verify Certificate:**

   ```sh
   openssl x509 -in .docker/traefik/certs/dev.localhost.crt -text -noout | grep -A 2 "Subject Alternative Name"
   ```

## **4. Validate Setup**

1. **Start Services:**

   ```sh
   docker compose up -d
   ```

2. **Test in Browser:**

- Visit **https://traefik.dev.localhost** — you should see the Traefik dashboard
- Visit **https://app.dev.localhost** — you should see your app
- Both should load without SSL warnings

## **5. Troubleshooting**

### **Certificate Files Missing**

If Traefik fails to start or shows TLS errors, verify the certificate files exist:

```sh
ls -la .docker/traefik/certs/
```

### **Browser Shows SSL Warning**

- Ensure mkcert root CA is installed (`mkcert -install`)
- For Firefox/Zen Browser, manually import the root CA (see section 2)
- Clear browser cache and restart the browser

### **Certificate Expiration**

mkcert certificates are valid for a long time, but if you need to regenerate:

1. **Remove old certificates:**

   ```sh
   rm .docker/traefik/certs/dev.localhost.*
   ```

2. **Regenerate (see section 3)**

## **6. Clean Up**

1. **Stop Services:**

   ```sh
   docker compose down
   ```

2. **Remove Certificates (Optional):**

   ```sh
   rm -rf .docker/traefik/certs
   ```

3. **Uninstall mkcert Root CA (Optional):**

   ```sh
   mkcert -uninstall
   ```

   > **Note:** Removing the root CA will cause SSL warnings in browsers until you reinstall it or regenerate certificates.
