use sql3644856;

create table Ubicacion(
    Numero tinyint primary key auto_increment,
    Lugar varchar(25) not null
);

create table Estatus_Articulo(
    Numero tinyint primary key auto_increment,
    Estado varchar(10) not null

);

create table Rol(
    Numero tinyint primary key auto_increment,
    Rol varchar(7) not null
);

create table Estatus_Reporte(
    Numero int primary key auto_increment,
    Estado varchar(10) not null
);

create table Usuario(
    Numero int primary key auto_increment,
    Nombre varchar(30) not null,
    ApePat varchar(20) not null,
    ApeMat varchar(20),
    NumCel char(10) not null,
    Correo varchar(30) not null,
    Passwd varchar(40) not null,
    Rol tinyint not null 
);

ALTER TABLE Usuario
ADD CONSTRAINT FK_Rol FOREIGN KEY (Rol) REFERENCES Rol (Numero);

create table Marca(
    Numero tinyint primary key auto_increment,
    Nombre varchar(25) not null
);

-- Crear campo para la imagen
create table Articulo(
    Num_Referencia int primary key auto_increment,
    Nombre varchar(30) not null,
    Modelo varchar(25) not null,
    Descripcion varchar(100) not null,
   -- Imagen blob 
    FechaCreacion timestamp default current_timestamp,
    Marca tinyint not null
);

-- Agregar una connection a artiuclo 
Create table Reporte(
    Numero int primary key auto_increment,
    Accion varchar(15) not null,
    FechaCreacion timestamp default current_timestamp,
    FechaAprobacion timestamp,
    Estatus int not null,
    Usuario int not null,
    Articulo int not null
);

ALTER TABLE Reporte
ADD CONSTRAINT FK_EstatusRep FOREIGN KEY (Estatus) REFERENCES Estatus_Reporte (Numero);

ALTER TABLE Reporte
ADD CONSTRAINT FK_UsuarioRep FOREIGN KEY (Usuario) REFERENCES Usuario (Numero);

ALTER TABLE Reporte
ADD CONSTRAINT FK_ArtRep FOREIGN KEY (Articulo) REFERENCES Articulo (Num_Referencia);



ALTER TABLE Articulo
ADD CONSTRAINT FK_MarcaArt FOREIGN KEY (Marca) REFERENCES Marca (Numero);

create table Usr_Art(
    Usuario int,
    Num_Referencia int
);

ALTER TABLE Usr_Art
ADD CONSTRAINT PK_UsrArt primary KEY (Usuario,Num_Referencia);

ALTER TABLE Usr_Art
ADD CONSTRAINT FK_UsrArt FOREIGN KEY (Usuario) REFERENCES Usuario (Numero);

ALTER TABLE Usr_Art
ADD CONSTRAINT FK_ArtUsr FOREIGN KEY (Num_Referencia) REFERENCES Articulo (Num_Referencia);

create table Art_Ubi(
    Ubicacion tinyint,
    Num_Referencia int,
    FechaEntrada timestamp default current_timestamp,
    FechaSalida timestamp,
    Comentario varchar(200) not null
);

ALTER TABLE Art_Ubi
ADD CONSTRAINT PK_ArtUbi primary KEY (Ubicacion,Num_Referencia);

ALTER TABLE Art_Ubi
ADD CONSTRAINT FK_ArtUbi FOREIGN KEY (Ubicacion) REFERENCES Ubicacion (Numero);

ALTER TABLE Art_Ubi
ADD CONSTRAINT FK_UbiArt FOREIGN KEY (Num_Referencia) REFERENCES Articulo (Num_Referencia);

create table Art_Est(
    Estatus tinyint,
    Num_Referencia int,
    Comentario varchar(200) not null
);

ALTER TABLE Art_Est
ADD CONSTRAINT PK_Art_Est primary KEY (Estatus,Num_Referencia);

ALTER TABLE Art_Est
ADD CONSTRAINT FK_Art_Est FOREIGN KEY (Estatus) REFERENCES Estatus_Articulo (Numero);

ALTER TABLE Art_Est
ADD CONSTRAINT FK_Est_Art FOREIGN KEY (Num_Referencia) REFERENCES Articulo (Num_Referencia);

