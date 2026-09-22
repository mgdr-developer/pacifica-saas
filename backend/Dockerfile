# 1.Usamos una imagen base oficial que soporta ARM64 (tu Mac) y AMD64 (Nube)
FROM eclipse-temurin:17-jre

# 2. Le decimos al contenedor en qué puerto va a vivir nuestra app
EXPOSE 8080

# 3. Definimos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# 4. Copiamos el archivo .jar que generaste en el paso anterior hacia adentro del contenedor
# (El asterisco nos ayuda por si la versión en el pom.xml cambia)
COPY target/*.jar app.jar

# 5. El comando que se ejecutará cuando encendamos el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]