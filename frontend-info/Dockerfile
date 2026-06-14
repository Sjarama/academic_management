FROM nginx:alpine
COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 5052
CMD ["nginx", "-g", "daemon off;"]
