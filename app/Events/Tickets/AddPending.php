<?php

namespace App\Events\Tickets;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AddPending implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public $ticket;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct($ticket)
	{
		$this->ticket = $ticket;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return \Illuminate\Broadcasting\Channel|array
	 */
	public function broadcastOn()
	{
		return new PrivateChannel("ticketOperator." . $this->ticket["operator_id"]);
	}
}
