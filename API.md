# FLIPSETTER API Interface
Note only currently listed methods are available on: `v1` API. Everything else still uses: `v0`

#### Current API endpoints
`dev` https://tippinweb.com/api/v1

`production` https://flipsetter.com/api/v1

### access_token expire in 3 months, refresh_token expire in 6 months

# Guest AUTH API:
`No Bearer tokens attached to headers`

#### Register

- **POST** - `/auth/register`

*Payload:*
```json
{
    "client_secret": "N4wHTddo8WRAXKUKH48XPND0YF0bghkyrYuxJKry",
    "first": "John",
    "last": "Doe",
    "email": "doe@example.org",
    "password": "Testing1!",
    "password_confirmation": "Testing1!"
}
```

*Response:*
```json
{
  "message": "Registration complete. Please login with your new credentials"
}
```

#### Login

- **POST** - `/auth/login`

> VOIP token is only on iPhone. These are examples of REAL device IDs and FCM tokens.

*Payload:*
```json
{
    "client_secret": "N4wHTddo8WRAXKUKH48XPND0YF0bghkyrYuxJKry",
    "email": "doe@example.org",
    "password": "Testing1!",
    "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
    "device_os": "ios",
    "device_name": "Doe iPhone",
    "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
    "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850",
}
```

*Response:*
```json
{
    "token_type": "Bearer",
    "expires_in": 7948800,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MTE5YjkwZS0zYjgyLTQ1MDgtYjc0Yi1hZDQ4Y2ExNDg1OGMiLCJqdGkiOiI5MmJjMTc4NDIyN2EzMjgzOWRlMTViZjljNWQ5MzhhMjExZGFhOGUwNzhhODljZmJmYTViMTAyNmFmMTMxZDY4OTZjMTJlMzkzOGM3Nzk5ZSIsImlhdCI6MTU5NTM5NzY4OSwibmJmIjoxNTk1Mzk3Njg5LCJleHAiOjE2MDMzNDY0ODksInN1YiI6IjkxMTliZGFlLWYxZGUtNDU3ZC05MjFkLWQ1YzYzMzNlYmYyMSIsInNjb3BlcyI6W119.SNlu6_WkdxSqSYcEWVcWlT7tR912qlolUJqUoesWPTcYpMy4fxj4K-hdCbdPYklNzLPYW603HynFMXpJ7KrwrmHcWH0ovnkmYOrxYfvLtHRc7c8oucRpurDCZah4gSyJvoWuDFouBogiPoPOC8y7HKZqoj0bPmZ4SVUJ_W39oWQXq44JffkGRc1Y7I37H0xsPhH6JYAO4et5UV7Hox3m56iod-i6tQ5ep6BWHc8HnzBoYy5oBjPhy1-a7rCJm0oIZ-OCSUx3KxwRY_3bebkIr302jkm17NWxeGC4z2CBig0zSLPfP0fntjwfeftZTr0H4LY3RzDyCOX-GKG2NB996zWrtQKO9OxYWtHRPtycTmSHDDc9dTJpLGzH_SLy2Pj2bt1kzAXYV3n7tWLAECnKLdx5CMuSwEKdneFu2oqquw5d8WNq8pcN0mxpn8LLyzWlpVFw8uI4BvrA_BfRU7gCY4Ql_ry39ZcjC122pJqjlcnnjTbWyjRVr_fUW1LPrqgL8lXWtbb_ueviHcwP3LARbB5TKIe2-r2QYCDD782FOPXEeDRBxqVFUNaB6F4e0GznnVHhrBAZOUd-R03sAYowuqAwX1tKIi7Kq3QKOijrm9z-nxTjTc_jpzzCfy8iMPwZ5X_fkv-ww6ICHiLbUfXf-hhhE5T9Muw8EagwfVPIuv8",
    "refresh_token": "def50200175dc9fec75d96ad46eabded060d99db877031fe129208256c62e3240ac3d157f2d229ac1210aabf749c1d2a86ec6d8249a32e65779584c6665dc539c64f159baa36bc4ecce8b8e2d7ae743bd10d58fc55668faf32376d8857b84121ab8036490388548bb83bf44066f83de8227bc4d72bf3a557d9351b10d576f6a78516e3993e1c9acbfe58032694259d92fc3824a6ae015497d772e54273abce67a6e0e740e1ed884eeaab1b3ee25e71f459c1e330d8f5e7e2abf741a6dd596894ac93b83dae53f0cfd22e582d1c5901f351a1499be1455b327f2ac6a5943471547e1630857b2c3cfa24693c30ddf71a59ffca5bdbc075cb6b51ea53cdd9b3abca0cc62a249eda54d6f24899987b9199da5c8cee4341fa6e396c7898ecd0e95e95bd1a1fd44a5bb5b76604133e9fc85bd8ffbc101e64ab2a25e3689b45d24256584af0914ee5d19e7f5d4a4c1543c7a6b43818e058e12fa7462753cf7079c6f7c9553e9ab0963006f1a0876a72990e2fa155709f281838fb0b13ab4dc7d4dd3c8f16b165f501a22fb758e5357a2f0902cbb49f74681a4dcc77091b6f21c61baae02fd3733afea5c03cb5"
}
```

#### Refresh expired access token

- **POST** - `/auth/refresh`

*Payload:*
```json
{
    "client_secret": "N4wHTddo8WRAXKUKH48XPND0YF0bghkyrYuxJKry",
    "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
    "device_os": "ios",
    "device_name": "Doe iPhone",
    "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
    "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850",
    "refresh_token": "def50200175dc9fec75d96ad46eabded060d99db877031fe129208256c62e3240ac3d157f2d229ac1210aabf749c1d2a86ec6d8249a32e65779584c6665dc539c64f159baa36bc4ecce8b8e2d7ae743bd10d58fc55668faf32376d8857b84121ab8036490388548bb83bf44066f83de8227bc4d72bf3a557d9351b10d576f6a78516e3993e1c9acbfe58032694259d92fc3824a6ae015497d772e54273abce67a6e0e740e1ed884eeaab1b3ee25e71f459c1e330d8f5e7e2abf741a6dd596894ac93b83dae53f0cfd22e582d1c5901f351a1499be1455b327f2ac6a5943471547e1630857b2c3cfa24693c30ddf71a59ffca5bdbc075cb6b51ea53cdd9b3abca0cc62a249eda54d6f24899987b9199da5c8cee4341fa6e396c7898ecd0e95e95bd1a1fd44a5bb5b76604133e9fc85bd8ffbc101e64ab2a25e3689b45d24256584af0914ee5d19e7f5d4a4c1543c7a6b43818e058e12fa7462753cf7079c6f7c9553e9ab0963006f1a0876a72990e2fa155709f281838fb0b13ab4dc7d4dd3c8f16b165f501a22fb758e5357a2f0902cbb49f74681a4dcc77091b6f21c61baae02fd3733afea5c03cb5"
}
```

*Response:*
```json
{
  "token_type": "Bearer",
  "expires_in": 7948800,
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MTE5YjkwZS0zYjgyLTQ1MDgtYjc0Yi1hZDQ4Y2ExNDg1OGMiLCJqdGkiOiI5MzljMGFlZWE2OGE0ZTMxY2YyODg1YjRjNDJjNGY3NjIxNDE5NTFhNGViMTNkYzg0NWJmMjI4YTI3N2U1NDc4YTUzNTA4Mzk5MjI0NTUzZiIsImlhdCI6MTU5NTM5OTM1OSwibmJmIjoxNTk1Mzk5MzU5LCJleHAiOjE2MDMzNDgxNTksInN1YiI6IjkxMTliZGFlLWYxZGUtNDU3ZC05MjFkLWQ1YzYzMzNlYmYyMSIsInNjb3BlcyI6W119.bNA6jGKxUkKgr8NGM5cvsLginwx3yhlAlpJhsYhj6I6Sj9zGtZA4-SCBSD-SPZQhp0sPOuA58NW26UBLKgdzKo4--WeM6IZnrj-EZEKZGs9iBNAKqa_ZM75g0iRK8DjRohB3UTE5AQi7Ulbyq31A3vD7kGRB5IN7fvVx2n4oR52XrPW94OUWPGrSOjM4lmDOKFxQWPDQM62ztlJF1Yc_Y13MP54Xnm3jUDYcOUFU8FsiI-Fu41pIGvWGhwc42F9mDspKGjHr2nRYAlgOwngz-6JMsdRtAsEb_SkKJ4TgwAdrtdNbUqg6WiS2TgVfzlTwJnckTNkq5VRStnZ7B4m0O7WZa4irBo_FUSA1y12mA9QSXtWRBFjKNegBjCgr7WuBx0-OfJn6aQe0yMGJhDN1G3fBzMm45OCoJV4K5iPwp0TdGSZHp8qomx1hLcs1axe8fe8WeNxUeq96Dk8aDzEw0AYHMWS01PLMpVR4XrquVX83yKGn2EvuT15C5-NWDbfmOA3eDU6tRU4vtrRGX3-JWLNK1M-Qfg7D5u1ID5ECp6bKB2ZCl5JDfOyDM44sIdJ9fwRwXX_WQ8gnGixvFSxiczLi9-06ngMuMyHNpOgaX96SH71m9YtLkdU589gX0uLyunsPCZow6eBCQkFK7dhqLHKr_Bq68JAWHFlal3Kc-S8",
  "refresh_token": "def50200485d26161a48f24e59b13ee05d7e30e2b8b23b9c75b0561009ce39df8ee5cdc975d9bdb632cf99b26bb9dcf5a6c60d028d309db3bc1fa6ce6aa535ae64199b67bd5b5494950aee5779b03f77b019d1de6d0c32a4910e7b54275c0a426c3ef27db4576558dca6ff9934375e9d7ea5850b2576ddf6667ad4f1f61481838c2b63e2c7c98c3e6aac79f851181ab6a5d520bca93d6a7017ca71ca5c9e792c0200176bef93cc60e4364cfb1441cc4e303fd39c2afe8edd211d9ccb343610582ffbcc4ae94dd57fb442407655f2596dcba5455326775bacc0458dc05989ee3125af1ca659ee85757102131501ffbe4ccc17a58d2089bcf7c602e0a3ff325c1b0867f327cde42363bcda023ddb4e9d27e1a0bc59399708fbd6686f509b802e524de2090d838d46a70342ee38dfb2873b04b766789eec37ce6196035fc9c44fce7df02075ac724b505bdfa9b3b445c007ca42507cbb829f2e1930a07a3db3102145cb2ab982e30fc57d074ae72a7eb3e40659117140ac5bac6627386b690c12baed88b4f25b3778cfeb7e630f7bcf033b6bce18cce784e5296522a7fe8eae3f2b6e6c38944ccf214b54"
}
```

#### Forgot Password

- **POST** - `/auth/password/email`

*Payload:*
```json
{
    "client_secret": "N4wHTddo8WRAXKUKH48XPND0YF0bghkyrYuxJKry",
    "email": "doe@example.org"
}
```

*Response:*
```json
{
  "message": "We have e-mailed your password reset link!"
}
```

# Authorized API:
`Bearer tokens attached to headers to access all following routes`

#### Logout

- **POST** - `/auth/logout`

*Payload:*
```json
{}
```

*Response:*
```json
{
  "message": "Logged out"
}
```


#### Resend email verification email

- **POST** - `/auth/email/resend`

*Payload:*
```json
{}
```

*Response:*
```json
{
  "message": "Resent verification email to doe@example.org"
}
```

#### User resource

- **GET** - `/user`

*Response:*
```json
{
    "id": "9119bdae-f1de-457d-921d-d5c6333ebf21",
    "first": "John",
    "last": "Doe",
    "email": "doe@example.org",
    "active": 1,
    "email_verified_at": null,
    "created_at": "2020-07-22T05:57:05.000000Z",
    "updated_at": "2020-07-22T05:57:05.000000Z",
    "name": "John Doe",
    "avatar": "/images/user/doe-uiwp-1595397425/thumb/users.png"
}
```

#### User recent login logs

- **GET** - `/user/logins`

*Response:*
```json
[
    {
        "id": "9119bf43-ba7e-4d39-a576-33dc1ecebef8",
        "user_id": "9119bdae-f1de-457d-921d-d5c6333ebf21",
        "ip": "127.0.0.1",
        "device_name": "DOE IPHONE",
        "continent": null,
        "continent_code": null,
        "country": null,
        "country_code": null,
        "region": null,
        "region_name": null,
        "city": null,
        "district": null,
        "zip": null,
        "lat": null,
        "lon": null,
        "timezone": "America/New_York",
        "currency": null,
        "isp": null,
        "org": null,
        "as": null,
        "mobile": null,
        "proxy": null,
        "hosting": null,
        "created_at": "2020-07-22T06:01:30.000000Z",
        "updated_at": "2020-07-22T06:01:30.000000Z"
    }
]
```

## User Devices API

#### Get all user device resources

- **GET** - `/user/devices`

*Response:*
```json
[
    {
        "id": "9119bf43-fbd5-4505-8694-7a235b8dfc35",
        "user_id": "9119bdae-f1de-457d-921d-d5c6333ebf21",
        "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
        "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
        "device_os": "ios",
        "device_name": "Doe iPhone",
        "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850",
        "created_at": "2020-07-22T06:01:31.000000Z",
        "updated_at": "2020-07-22T06:29:20.000000Z"
    }
]
```

#### Show user device resource

- **GET** - `/user/devices/{device_id}`

*Response:*
```json
{
    "id": "9119bf43-fbd5-4505-8694-7a235b8dfc35",
    "user_id": "9119bdae-f1de-457d-921d-d5c6333ebf21",
    "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
    "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
    "device_os": "ios",
    "device_name": "Doe iPhone",
    "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850",
    "created_at": "2020-07-22T06:01:31.000000Z",
    "updated_at": "2020-07-22T06:29:20.000000Z"
}
```

#### Store/update current user device info

- **POST** - `/user/devices`

*Payload:*
```json
{
    "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
    "device_os": "ios",
    "device_name": "Doe iPhone New Name",
    "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
    "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850"
}
```

*Response:*
```json
{
    "id": "9119bf43-fbd5-4505-8694-7a235b8dfc35",
    "user_id": "9119bdae-f1de-457d-921d-d5c6333ebf21",
    "device_id": "0B5FF6BA-48B3-444B-A3C5-3C50299BF80D",
    "device_token": "fskiX8-VHhc:APA91bEMPsHbAR5uuBDDMAez2Lg0z0-xNYB-knjH9i54xNO_yt8icMHB3Lr9BOaJr4xdTyCLCF8mNzg2dq81ZsvPqmkFhwrZwOdCMcI7gqB-16C9T86DAZZ9jZmLqqRA0O0_Ouk8b6Tb",
    "device_os": "ios",
    "device_name": "Doe iPhone New Name",
    "voip_token": "b86f8556c575869d169e06e184a4c7dad0771d12247cd27e76f6b10d4955d850",
    "created_at": "2020-07-22T06:01:31.000000Z",
    "updated_at": "2020-07-22T06:53:45.000000Z"
}
```

#### Destroy and logout selected user device

- **DELETE** - `/user/devices/{device_id}`

*Response:*
```json
{
  "message": "Doe iPhone New Name has been logged out and removed"
}
```