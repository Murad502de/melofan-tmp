<?php

namespace App\Events\Tickets;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Apply implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public $idTicket;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct($idTicket)
	{
		$this->idTicket = $idTicket;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return \Illuminate\Broadcasting\Channel|array
	 */
	public function broadcastOn()
	{
		return new PrivateChannel("allTicketOperators");
	}
}
