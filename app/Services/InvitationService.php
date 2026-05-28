<?php

namespace App\Services;

use App\Repositories\InvitationRepository;
use Illuminate\Support\Str;

class InvitationService
{
    public function __construct(private readonly InvitationRepository $repository)
    {
    }

    public function create(array $payload)
    {
        return $this->repository->create([
            'event_id' => $payload['event_id'],
            'invitation_type' => $payload['invitation_type'],
            'channel' => $payload['channel'],
            'recipient_name' => $payload['recipient_name'],
            'recipient_email' => $payload['recipient_email'] ?? null,
            'recipient_phone' => $payload['recipient_phone'] ?? null,
            'token' => Str::uuid()->toString(),
            'message' => $payload['message'] ?? null,
            'status' => 'draft',
        ]);
    }

    public function send(int $invitationId)
    {
        $invitation = $this->repository->findById($invitationId);

        if (! $invitation) {
            return null;
        }

        $invitation->forceFill([
            'status' => 'sent',
            'sent_at' => now(),
            'qr_code' => base64_encode($invitation->token),
        ])->save();

        return $invitation;
    }

    public function rsvp(array $payload)
    {
        $invitation = $this->repository->findByToken($payload['token']);

        if (! $invitation) {
            return null;
        }

        $response = $payload['response'];

        $invitation->update([
            'status' => $response === 'accept' ? 'accepted' : 'declined',
        ]);

        return $this->repository->response([
            'invitation_id' => $invitation->id,
            'response' => $response,
            'responded_at' => now(),
            'notes' => $payload['notes'] ?? null,
        ]);
    }
}
