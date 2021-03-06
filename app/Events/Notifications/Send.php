<?php

namespace App\Events\Notifications;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Send implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public $message;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct($message)
	{
		$this->message = $message;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return \Illuminate\Broadcasting\Channel|array
	 */
	public function broadcastOn()
	{
		return new PrivateChannel("user." . $this->message["user_id"]);
	}
}
