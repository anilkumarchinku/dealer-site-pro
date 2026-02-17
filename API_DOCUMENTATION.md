# Domain Onboarding API Documentation

Complete REST API documentation for the DealerSite Pro domain onboarding system.

---

## Base URL
```
/api/domain
```

---

## Authentication
**Status**: To be implemented
**Planned**: All endpoints will require authentication via JWT token or session cookie.
**Current**: Demo endpoints accept `user_id` in request body for testing.

---

## Endpoints Overview

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/start-onboarding` | Initialize domain onboarding | ✅ Live |
| POST | `/verify-ownership` | Start domain verification | ✅ Live |
| GET | `/verification-status/[id]` | Check verification status | ✅ Live |
| GET | `/dns-scan/[id]` | Perform DNS analysis | ✅ Live |
| POST | `/configure` | Configure DNS records | ✅ Live |
| GET | `/propagation-status/[id]` | Check DNS propagation | ✅ Live |
| GET | `/download-verification-file` | Download HTML verification file | ✅ Live |
| POST | `/deploy` | Trigger deployment | 🚧 Coming soon |
| GET | `/deployment-status/[id]` | Monitor deployment | 🚧 Coming soon |
| POST | `/go-live` | Final activation | 🚧 Coming soon |

---

## 1. Start Onboarding

**POST** `/api/domain/start-onboarding`

Initialize a new domain onboarding process.

### Request Body
```json
{
  "user_id": "string (required)",
  "domain_name": "string (required)",
  "registrar": "string (optional)",
  "access_level": "full | limited (optional, default: full)"
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/domain/start-onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "domain_name": "mydealership.com",
    "registrar": "godaddy",
    "access_level": "full"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "onboarding_id": "uuid",
  "domain_name": "mydealership.com",
  "verification_token": "dealersite-verify-abc123...",
  "expires_at": "2024-03-15T10:30:00Z",
  "current_state": "domain_collection",
  "next_steps": [
    "Choose verification method (DNS TXT or HTML file)",
    "Complete domain ownership verification",
    "DNS analysis will be performed automatically"
  ]
}
```

### Errors
- **400**: Missing required fields or invalid domain format
- **500**: Server error

---

## 2. Verify Ownership

**POST** `/api/domain/verify-ownership`

Start domain ownership verification using selected method.

### Request Body
```json
{
  "onboarding_id": "string (required)",
  "method": "dns_txt | html_file | email (required)"
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/domain/verify-ownership \
  -H "Content-Type: application/json" \
  -d '{
    "onboarding_id": "abc-123-def-456",
    "method": "dns_txt"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "verified": false,
  "method": "dns_txt",
  "instructions": {
    "method": "dns_txt",
    "steps": [
      "Log in to your domain registrar",
      "Navigate to DNS settings",
      "Add a new TXT record with name: @ or mydealership.com",
      "Set the value to: dealersite-verify-abc123...",
      "Save changes and wait 5-10 minutes for DNS propagation",
      "Click 'Verify' button to check"
    ],
    "txt_record": {
      "name": "@",
      "type": "TXT",
      "value": "dealersite-verify-abc123...",
      "ttl": 300
    }
  },
  "result": {
    "verified": false,
    "found_records": [],
    "error": "TXT record not found yet"
  },
  "next_action": "Follow the instructions and click verify again when ready."
}
```

### Errors
- **400**: Invalid method or missing onboarding_id
- **400**: Verification token expired
- **500**: Server error

---

## 3. Verification Status

**GET** `/api/domain/verification-status/[id]`

Check the current verification status and attempt verification.

### Path Parameters
- `id`: Onboarding ID (UUID)

### Example Request
```bash
curl http://localhost:3000/api/domain/verification-status/abc-123-def-456
```

### Response (200 OK) - Not Yet Verified
```json
{
  "success": true,
  "verified": false,
  "method": "dns_txt",
  "current_state": "verification_pending",
  "attempts": 3,
  "expires_in": {
    "hours": 18,
    "minutes": 42,
    "timestamp": "2024-03-15T10:30:00Z"
  },
  "result": {
    "verified": false,
    "found_records": ["some-other-txt-record"],
    "error": "Verification token not found in DNS records"
  },
  "next_step": "continue_verification"
}
```

### Response (200 OK) - Verified
```json
{
  "success": true,
  "verified": true,
  "method": "dns_txt",
  "verified_at": "2024-03-14T15:45:00Z",
  "current_state": "verification_complete",
  "next_step": "dns_analysis"
}
```

### Errors
- **400**: Missing onboarding ID
- **500**: Server error

---

## 4. DNS Scan

**GET** `/api/domain/dns-scan/[id]`

Perform comprehensive DNS analysis and recommend deployment route.

### Path Parameters
- `id`: Onboarding ID (UUID)

### Example Request
```bash
curl http://localhost:3000/api/domain/dns-scan/abc-123-def-456
```

### Response (200 OK)
```json
{
  "success": true,
  "onboarding_id": "abc-123-def-456",
  "analysis": {
    "domain": "mydealership.com",
    "scan_timestamp": "2024-03-14T15:50:00Z",
    "dns_records": {
      "nameservers": ["ns1.godaddy.com", "ns2.godaddy.com"],
      "a_records": ["123.45.67.89"],
      "mx_records": ["mail.mydealership.com"],
      "txt_records_count": 5,
      "cname_records": {
        "www": "mydealership.com"
      }
    },
    "existing_services": {
      "has_active_website": true,
      "has_email": true,
      "using_cloudflare": false
    },
    "registrar": {
      "detected": "godaddy",
      "confidence": "high",
      "nameserver_pattern": "ns1.godaddy.com"
    },
    "recommendation": {
      "route": "subdomain",
      "reason": "Subdomain deployment recommended to preserve existing services (website/email).",
      "warnings": [
        "Email service detected. MX records will be preserved.",
        "Active website detected. Consider backup before proceeding."
      ],
      "explanation": "We recommend deploying on a subdomain (e.g., shop.yourdomain.com) to preserve your existing website and email services."
    }
  },
  "next_steps": [
    "Review the DNS analysis results",
    "Choose a subdomain name (e.g., shop, store, cars)",
    "Configure DNS records",
    "Wait for DNS propagation"
  ],
  "configuration_options": {
    "full_domain": {
      "available": true,
      "impact": "Will replace existing website/email services",
      "recommended": false
    },
    "subdomain": {
      "available": true,
      "impact": "Preserves all existing services",
      "recommended": true,
      "suggested_names": ["shop", "store", "cars", "auto", "showroom"]
    }
  }
}
```

### Errors
- **400**: Domain verification required first
- **500**: DNS scan failed

---

## 5. Configure DNS

**POST** `/api/domain/configure`

Generate DNS configuration instructions based on chosen route.

### Request Body
```json
{
  "onboarding_id": "string (required)",
  "deployment_route": "full_domain | subdomain (required)",
  "subdomain": "string (required if route is subdomain)"
}
```

### Example Request
```bash
curl -X POST http://localhost:3000/api/domain/configure \
  -H "Content-Type: application/json" \
  -d '{
    "onboarding_id": "abc-123-def-456",
    "deployment_route": "subdomain",
    "subdomain": "shop"
  }'
```

### Response (200 OK)
```json
{
  "success": true,
  "onboarding_id": "abc-123-def-456",
  "target_domain": "shop.mydealership.com",
  "deployment_route": "subdomain",
  "dns_instructions": {
    "deployment_route": "subdomain",
    "target_domain": "shop.mydealership.com",
    "records_to_add": [
      {
        "type": "A",
        "name": "shop",
        "value": "123.45.67.89",
        "ttl": 300,
        "description": "Points shop subdomain to our servers"
      },
      {
        "type": "TXT",
        "name": "shop",
        "value": "v=dealersite-pro",
        "ttl": 300,
        "description": "Verification record"
      }
    ]
  },
  "manual_configuration": {
    "title": "Configure Your DNS Records",
    "steps": [
      "Log in to your domain registrar account",
      "Navigate to DNS management / DNS settings",
      "Add the DNS records shown below",
      "Save your changes",
      "Wait 5-30 minutes for DNS propagation",
      "Click 'Check Propagation' to verify"
    ],
    "registrar_specific_help": {
      "godaddy": "DNS Settings → Manage → Add Record",
      "namecheap": "Advanced DNS → Add New Record",
      "bigrock": "Manage DNS → Add Record"
    }
  },
  "cloudflare_option": {
    "available": true,
    "benefits": [
      "Automated DNS configuration",
      "Free SSL certificate",
      "Faster propagation (5-10 minutes)",
      "CDN and DDoS protection"
    ],
    "nameservers": ["ns1.cloudflare.com", "ns2.cloudflare.com"]
  },
  "estimated_propagation_time": "5-30 minutes",
  "next_step": "Add DNS records and check propagation status"
}
```

### Errors
- **400**: Invalid deployment route or missing subdomain
- **500**: Configuration failed

---

## 6. Propagation Status

**GET** `/api/domain/propagation-status/[id]`

Check DNS propagation status for configured domain.

### Path Parameters
- `id`: Onboarding ID (UUID)

### Example Request
```bash
curl http://localhost:3000/api/domain/propagation-status/abc-123-def-456
```

### Response (200 OK) - In Progress
```json
{
  "success": true,
  "onboarding_id": "abc-123-def-456",
  "target_domain": "shop.mydealership.com",
  "propagation_status": {
    "overall": {
      "percentage": 66,
      "fully_propagated": false,
      "checks_passed": 2,
      "total_checks": 3
    },
    "records": {
      "a_record": {
        "propagated": true,
        "current_values": ["123.45.67.89"],
        "expected_value": "123.45.67.89"
      },
      "www_record": {
        "propagated": false,
        "current_values": [],
        "expected_value": "123.45.67.89"
      },
      "txt_record": {
        "propagated": true,
        "current_values": ["v=dealersite-pro"],
        "expected_pattern": "dealersite-pro"
      }
    },
    "estimated_time_remaining": "15-30 minutes"
  },
  "current_state": "configuration_pending",
  "next_step": "DNS is still propagating. This typically takes 5-30 minutes. We'll keep checking automatically.",
  "actions": ["wait_and_recheck", "verify_dns_records"]
}
```

### Response (200 OK) - Complete
```json
{
  "success": true,
  "onboarding_id": "abc-123-def-456",
  "target_domain": "shop.mydealership.com",
  "propagation_status": {
    "overall": {
      "percentage": 100,
      "fully_propagated": true,
      "checks_passed": 2,
      "total_checks": 2
    },
    "records": {
      "a_record": {
        "propagated": true,
        "current_values": ["123.45.67.89"],
        "expected_value": "123.45.67.89"
      },
      "txt_record": {
        "propagated": true,
        "current_values": ["v=dealersite-pro"],
        "expected_pattern": "dealersite-pro"
      }
    },
    "estimated_time_remaining": "Complete"
  },
  "current_state": "configuration_complete",
  "next_step": "DNS propagation complete! Ready for SSL provisioning and deployment.",
  "actions": ["proceed_to_ssl", "proceed_to_deployment"]
}
```

### Errors
- **400**: Missing onboarding ID
- **500**: Failed to check propagation

---

## 7. Download Verification File

**GET** `/api/domain/download-verification-file`

Download HTML verification file for domain ownership verification.

### Query Parameters
- `token`: Verification token (string, required)

### Example Request
```bash
curl "http://localhost:3000/api/domain/download-verification-file?token=dealersite-verify-abc123" \
  -o dealersite-verify.html
```

### Response (200 OK)
Returns an HTML file with Content-Type: `text/html` and Content-Disposition: `attachment`.

### File Content Example
```html
<!DOCTYPE html>
<html>
<head>
    <title>DealerSite Pro Domain Verification</title>
</head>
<body>
    <h1>DealerSite Pro Domain Verification</h1>
    <p>Verification Token: dealersite-verify-abc123...</p>
</body>
</html>
```

### Errors
- **400**: Missing verification token
- **500**: Failed to generate file

---

## State Machine

The domain onboarding process follows this state flow:

```
domain_collection
    ↓
verification_pending
    ↓
verification_complete
    ↓
dns_analysis
    ↓
route_selection
    ↓
configuration_pending
    ↓
configuration_complete
    ↓
ssl_provisioning
    ↓
deployment
    ↓
testing
    ↓
live
```

At any point, the state can transition to `failed` if errors occur.

---

## Error Handling

All endpoints follow this error response format:

```json
{
  "error": "Human-readable error message",
  "details": "Optional technical details",
  "code": "ERROR_CODE (optional)"
}
```

### Common HTTP Status Codes
- **200**: Success
- **400**: Bad request (validation error, missing fields)
- **401**: Unauthorized (when auth is implemented)
- **404**: Resource not found
- **500**: Internal server error

---

## Rate Limiting

**Status**: Not yet implemented
**Planned**:
- Verification attempts: Max 10 per hour per domain
- DNS scans: Max 20 per hour per user
- Propagation checks: Max 60 per hour per onboarding

---

## Database Integration

**Status**: Mock data currently used
**Planned**: Supabase integration with these tables:
- `domain_onboardings` - Main onboarding records
- `verification_attempts` - Audit log of verification attempts
- `registrar_templates` - Registrar-specific instructions

---

## Next Steps

1. Implement deployment endpoints (`/deploy`, `/deployment-status`, `/go-live`)
2. Add Cloudflare API integration for automated DNS configuration
3. Integrate with Supabase for data persistence
4. Add authentication and rate limiting
5. Create registrar instruction templates
6. Build deployment orchestration pipeline

---

## Support

For issues or questions about the API, contact the development team or create an issue in the project repository.
