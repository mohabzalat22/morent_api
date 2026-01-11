# Morent API

A car rental REST API built with Laravel 11.

## Features

-   **Car Listings** - Browse available cars with filtering by type, model, and capacity
-   **Car Details** - View detailed information about each car including specifications
-   **Reservations** - Book cars with pick-up/drop-off locations and times
-   **Reviews** - Leave and view reviews with star ratings for cars
-   **User Authentication** - Secure API authentication using Laravel Sanctum
-   **Payments** - Store payment information for users

## Requirements

-   PHP 8.2+
-   Composer
-   MySQL or SQLite

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd morent_api
```

2. Install dependencies

```bash
composer install
```

3. Copy environment file and configure database

```bash
cp .env.example .env
php artisan key:generate
```

4. Run migrations

```bash
php artisan migrate
```

5. (Optional) Seed the database

```bash
php artisan db:seed
```

6. Start the development server

```bash
php artisan serve
```

## API Endpoints

### Public Routes

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/v1/`                | Home - Get featured cars             |
| GET    | `/api/v1/category`        | List all car categories              |
| GET    | `/api/v1/category/data`   | Get filter data (models, capacities) |
| POST   | `/api/v1/category/filter` | Filter cars by criteria              |
| GET    | `/api/v1/detail/{id}`     | Get car details                      |
| POST   | `/api/v1/detail/filter`   | Filter related cars                  |

### Protected Routes (Requires Authentication)

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/user`                   | Get authenticated user |
| POST   | `/api/user/data/reservations` | Get user reservations  |
| POST   | `/api/user/data/reviews`      | Get user reviews       |
| POST   | `/api/user/data/make/review`  | Create a review        |

## Testing

Run tests using Pest:

```bash
./vendor/bin/pest
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
