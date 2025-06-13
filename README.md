## About the platform
**[Umedu](https://umedu.omsimos.com)** is a social platform that automatically creates private forums for students based on their _.edu_ email address. For example, if you authenticate with an email like `hello@myschool.edu.ph`, you’ll be able to access the `myschool` private forum.

## Anonymity and privacy

To protect the privacy of our users, **we do not store your email address or any personal information.** Authenticating with your school email simply creates a session in your browser that grants access to a private forum based on your _.edu_ email domain.

---

## Contributing

If you like this project, please consider giving it a star! ✨ If you wish to suggest or work on a new feature, please open an issue to discuss with the community and the project maintainers. We appreciate your interest and look forward to collaborating with you!

### Tech Stack

TypeScript, Next.js (RSC, Server Actions, & Route Handlers), Tailwind CSS, TanStack Query, Drizzle ORM, libSQL

### Prerequisites

- [Turso CLI](https://docs.turso.tech/cli/installation) (for local libSQL server)
- Node.js >= 20
- Bun (package manager)

### Install Dependencies

If you're using `nvm`, you can easily switch to the required Node.js version.
```sh
$ nvm use 20 # ignore if you're already on Node.js >= 20
$ bun install
```

### Environment Variables
```env
# .env

APP_URL=http://localhost:3000 # For using fetch with RSC
TURSO_CONNECTION_URL=http://127.0.0.1:8080
WHITELIST=your@email.com # If you don't have a .edu email
```

You must setup your own Google OAuth client. [Setting up OAuth 2.0 &rarr;](https://support.google.com/cloud/answer/6158849)
```env
# .env

GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Development Server
```sh
$ bun dev
```

### Setup Database
Running a development server will also run a local `libSQL` server and create a database for you. Run the migration command below to apply the schema.
```sh
$ bun db:migrate
$ bun db:studio # To explore your database (optional)
```

### Running Build
After making changes, you can run a build which will check for lint and type errors.
```sh
$ bun run build
```

Once ready, you can submit a pull request for review.

---

## License
This repository is licensed under the [GPL-3.0 License](https://github.com/joshxfi/umedu/blob/main/LICENSE).
