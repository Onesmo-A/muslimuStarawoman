# API Endpoint Documentation

Base URL: `/api/v1`

| Module | Method | Endpoint | Auth | Permission | Description |
|---|---|---|---|---|---|
| Auth | POST | `/auth/register` | No | - | Register account |
| Auth | POST | `/auth/login` | No | - | Login and issue Sanctum token |
| Auth | POST | `/auth/logout` | Yes | - | Logout current token |
| Auth | GET | `/auth/me` | Yes | - | Current user profile |
| Auth | POST | `/auth/forgot-password` | No | - | Send reset link |
| Auth | POST | `/auth/reset-password` | No | - | Reset password |
| Public | GET | `/public/home` | No | - | Home hero/highlights/winners |
| Public | GET | `/public/categories` | No | - | Categories and pricing |
| Public | GET | `/public/nominees` | No | - | Nominees list |
| Public | GET | `/public/sponsors` | No | - | Sponsors list |
| Public | GET | `/public/posts` | No | - | Blog posts |
| Public | GET | `/public/pages` | No | - | CMS pages |
| Events | GET | `/events` | No | - | List public events |
| Events | GET | `/events/{id}` | No | - | Event details |
| Nominations | GET | `/nominations` | Yes | - | Current user nominations |
| Nominations | POST | `/nominations` | Yes | - | Create nomination draft |
| Nominations | POST | `/nominations/{id}/files` | Yes | - | Upload nomination file |
| Nominations | POST | `/nominations/{id}/submit` | Yes | - | Submit nomination |
| Nominations | GET | `/nominations/{id}/status` | Yes | - | Check nomination status |
| Payments | POST | `/payments/initiate` | Yes | - | Initiate payment |
| Payments | POST | `/payments/verify` | Yes | - | Verify payment |
| Payments | POST | `/payments/webhook` | No | - | Gateway webhook endpoint |
| Tickets | GET | `/tickets/events` | Yes | - | Events with ticket sales |
| Tickets | POST | `/tickets/purchase` | Yes | - | Purchase ticket |
| Tickets | POST | `/tickets/validate` | Yes | - | Validate/scan ticket |
| Voting | POST | `/voting/cast` | Optional | - | Cast vote with throttling |
| Voting | GET | `/voting/eligibility` | Optional | - | Vote eligibility by category |
| Sponsors | GET | `/sponsors/packages` | No | - | Sponsor package listing |
| Sponsors | POST | `/sponsors/purchase` | Yes | - | Purchase sponsor package |
| Invitations | POST | `/invitations/rsvp` | No | - | RSVP accept/decline |
| Admin | GET | `/admin/dashboard` | Yes | `manage_dashboard` | KPI dashboard |
| Admin | POST | `/admin/events` | Yes | `manage_content` | Create event |
| Admin | PUT | `/admin/events/{id}` | Yes | `manage_content` | Update event |
| Admin | POST | `/admin/invitations` | Yes | `manage_nominations` | Create invitation |
| Admin | POST | `/admin/invitations/send` | Yes | `manage_nominations` | Send invitation |
| Admin | POST | `/admin/winners/publish` | Yes | `manage_reports` | Publish winners |
| Admin | GET | `/admin/reports/export` | Yes | `manage_reports` | Export reports (`csv`, `excel`, `pdf`) |
| Admin | POST | `/admin/scores` | Yes | `manage_scores` | Save judge score |
| Admin | GET | `/admin/scores/aggregate` | Yes | `manage_scores` | Aggregate weighted score |
| Admin | POST | `/admin/sms-campaigns` | Yes | `manage_sms` | Create SMS campaign |
| Admin | POST | `/admin/sms-campaigns/send` | Yes | `manage_sms` | Queue SMS campaign delivery |
| Winners | GET | `/winners?award_season_id={id}` | No | - | Published winners by season |

All endpoints return:

```json
{
  "success": true,
  "data": {},
  "message": "...",
  "meta": {},
  "errors": {}
}
```
