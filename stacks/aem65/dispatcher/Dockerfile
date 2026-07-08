# ============================================================================
#  Modern AEM Dispatcher image for AEM 6.5
#  Base: httpd:2.4 (current Debian) instead of the old image's CentOS 7 (EOL).
#  Includes BOTH modules (HTTP and SSL) so you can choose without rebuilding.
# ============================================================================
FROM httpd:2.4

# --- Metadata (good practice: identifies your image) ---
LABEL maintainer="Ghostmangenius"
LABEL description="AEM 6.5 Dispatcher over modern Apache 2.4"

# --- Copy the two modules into the image ---
# They go to Apache's modules folder in the httpd:2.4 image.
COPY modules/mod_dispatcher.so     /usr/local/apache2/modules/mod_dispatcher.so
COPY modules/mod_dispatcher_ssl.so /usr/local/apache2/modules/mod_dispatcher_ssl.so

# --- Copy the Apache and dispatcher configuration ---
COPY conf/httpd.conf      /usr/local/apache2/conf/httpd.conf
COPY conf/dispatcher.any  /usr/local/apache2/conf/dispatcher.any

# --- Create the folder where the dispatcher will store the cache ---
RUN mkdir -p /var/www/html && chmod 777 /var/www/html

# --- The dispatcher listens on port 80 (HTTP) inside the container ---
# When you enable SSL, you'll also use 443. We expose both from the start.
EXPOSE 80 443

# --- Start Apache in the foreground (so the container stays alive) ---
CMD ["httpd-foreground"]