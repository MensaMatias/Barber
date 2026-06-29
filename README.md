# Barber

A web application developed with Angular for managing a barbershop. It allows users to register, log in, book appointments, and browse available products. It also features an administration panel for managing users and bookings.

## Description

Barber is a Single Page Application (SPA) designed for managing a modern barbershop. The system allows customers to easily book appointments and view available products, while administrators can monitor bookings and registered users.

The project was developed using a **Mobile First** approach, ensuring a good experience on mobile devices and adapting to larger screens later.

## Main Features

### Users

* New user registration.

* Login.

* Persistent session.

* Differentiated user roles (Customer and Admin).

* Profile management via custom authentication.

### Bookings

* Booking appointments for different services.

* Validation of required fields.

* Past date restriction.

* Validation of available times.

* Prevention of duplicate bookings.

* Appointment cancellation.

* Viewing of user bookings.

### Products

* Barber shop product catalog.

* Product search.

* Filtering by category.

* Responsive design for mobile and desktop devices.

### Administration

* Exclusive administrator panel.

* Viewing of all registered users.

* Viewing of all bookings.

* Search for bookings by email address.

* Booking deletion.


## Technologies Used

* Angular 21
* TypeScript
* HTML5
* CSS3
* Supabase
* RxJS
* Angular Router
* Angular Forms (Reactive Forms and Template Forms)

## Project Architecture

The project is organized using Angular components and services:

* Components: user interface.

* Services: business logic and data access.

* Models: entity definition.

* Guards: path protection based on permissions.

* Supabase: data storage and persistence.

##Database

The application uses Supabase as a backend to store:

### Users

* ID
* Name
* Email
* Password
* Role

### Reservations

* ID
* Username/Email
* Date
* Time
* Service

## Seguridad

La aplicación utiliza Supabase como base de datos.

Se implementó Row Level Security (RLS) para proteger el acceso mediante la API pública de Supabase.

## Installation

Clone the repository:

```Tap:
`Clone git https://github.com/MensaMatias/Barber.git
```

Next to the directory:

```Tap:
`cd barbero
```

Install dependencies:

```Tap:
`install npm
```

Run the project:

```Tap:
`server
```

Open in the browser:

```text:
`http://localhost:4200
```

## Implemented features

* Authentication system.

* User roles.

* Appointment booking.

* Appointment cancellation.

* Administrative panel.

* User management.

* Appointment management.

* Integration with Supabase.

* Mobile-first responsive design.

* Notifications via Brindis.

* Product catalog.

## Repository

GitHub:

https://github.com/MensaMatias/Barber

## 📸 Screenshots

### Home page
![Home](/public/assets/img/screenshots/Home.png)

### About
![About](/public/assets/img/screenshots/About.png)

### Shift management
![Reserve](/public/assets/img/screenshots/Reserve.png)

### Product catalog
![Products](/public/assets/img/screenshots/Products.png)

### Administration Panel
![Admin](/public/assets/img/screenshots/Admin.png)

## Author

Matías Mensa