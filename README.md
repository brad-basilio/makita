# Builder - E-commerce Page Builder

A drag-and-drop e-commerce page builder that allows you to create complete online stores by assembling pre-built components.

## Features

- Drag and drop interface
- Pre-built e-commerce components
- Responsive design
- Real-time preview
- Component customization
- Multiple layout options

## Prerequisites

- PHP >= 8.1
- Composer
- Node.js & NPM
- MySQL
- XAMPP/Apache

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your .env file with your database and application settings:
```bash
APP_NAME="Your Application Name"
APP_ENV=local
APP_CORRELATIVE="your_application_name"
```

5. Generate application key:
```bash
php artisan key:generate
```

6. Run database migrations:
```bash
php artisan migrate
```
7. Install JavaScript dependencies:
```bash
npm install
```

8. Create symbolic link for storage:
```bash
ln -s "[ABSOLUTE_PATH]/storage/app/images" "[ABSOLUTE_PATH]/public/storage/images" 
ln -s "[ABSOLUTE_PATH]/storage/app/images/repository" "[ABSOLUTE_PATH]/public/cloud"
```