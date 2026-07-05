# Figgy Dating App - Backend API

Complete backend for Figgy dating app with:
- User authentication & profiles
- Video call management (Agora RTC)
- Payment integration (TKPAY: bKash, Nagad, Rocket)
- Admin dashboard APIs
- Firebase integration
- Real-time messaging

## Quick Start

```bash
npm install
npm start
```

## Environment Variables

See `.env.example` for required variables

## Payment Integration

### TKPAY (Betnzy)
Supports Bangladesh payment methods:
- bKash (Channel 34)
- Nagad (Channel 35)
- Rocket (Channel 46)

Configure via admin panel:
- Merchant ID: 9eaee712-6905-47e4-9a4a-07fb26e14f3d
- Hash Key: (get from Betnzy)
- API URL: https://tkm.worldxxpp.com

## API Endpoints

### Payment
- `POST /api/client/tkpay/createOrder` - Create payment order
- `GET /api/client/tkpay/verify/:shopOrderId` - Verify payment status
- `POST /api/client/tkpay/callback` - TKPAY server callback

### User
- `POST /api/client/user/signInOrSignUpUser` - Auth
- `GET /api/client/user/retrieveUserProfile` - Get profile
- `PATCH /api/client/user/modifyUserProfile` - Update profile

### Admin
- `PATCH /api/admin/setting/updateSetting` - Configure settings
- `GET /api/admin/setting/fetchSettings` - Get settings

## Screenshots Protected
Video call screens are screenshot-protected on both Android & iOS

## Deployment

See COMPLETE_HOSTING_GUIDE.md for Railway, DigitalOcean, or Heroku setup
