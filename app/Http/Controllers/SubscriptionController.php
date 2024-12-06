<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use SoDe\Extend\Text;

class SubscriptionController extends BasicController
{
    public $model = Subscription::class;

    public function beforeSave(Request $request)
    {
        $provider = Text::getEmailProvider($request->email);
        $subscription = $this->model::select('id')->where('description', $request->email)->first();
        return [
            'id' => $subscription->id ?? null,
            'name' => $provider,
            'description' => $request->email
        ];
    }
}
