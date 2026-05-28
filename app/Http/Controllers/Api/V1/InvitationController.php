<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Invitations\RsvpInvitationRequest;
use App\Http\Requests\Invitations\SendInvitationRequest;
use App\Http\Requests\Invitations\StoreInvitationRequest;
use App\Services\InvitationService;

class InvitationController extends BaseApiController
{
    public function __construct(private readonly InvitationService $invitationService)
    {
    }

    public function create(StoreInvitationRequest $request)
    {
        $invitation = $this->invitationService->create($request->validated());

        return $this->successResponse($invitation, 'Invitation created', status: 201);
    }

    public function send(SendInvitationRequest $request)
    {
        $invitation = $this->invitationService->send((int) $request->integer('invitation_id'));

        if (! $invitation) {
            return $this->errorResponse('Invitation not found', 404);
        }

        return $this->successResponse($invitation, 'Invitation sent');
    }

    public function rsvp(RsvpInvitationRequest $request)
    {
        $response = $this->invitationService->rsvp($request->validated());

        if (! $response) {
            return $this->errorResponse('Invitation token not found', 404);
        }

        return $this->successResponse($response, 'RSVP received');
    }
}
