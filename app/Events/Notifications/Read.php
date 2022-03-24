<?php

namespace App\Events\Notifications;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Read implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	private $user_id;
	public $arrayIdMessages;

	/**
	 * Create a new event instance.
	 *
	 * @return void
	 */
	public function __construct($user_id, $arrayIdMessages)
	{
		$this->user_id = $user_id;
		$this->arrayIdMessages = $arrayIdMessages;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return \Illuminate\Broadcasting\Channel|array
	 */
	public function broadcastOn()
	{
		return new PrivateChannel("user." . $this->user_id);
	}
}
