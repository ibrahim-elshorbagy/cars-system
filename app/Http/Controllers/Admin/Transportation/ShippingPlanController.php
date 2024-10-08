<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Transportation\PortResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\ShippingPlanResource;
use App\Models\Admin\Transportation\City;
use App\Models\Admin\Transportation\Destination;
use App\Models\Admin\Transportation\Port;
use App\Models\Admin\Transportation\ShippingPlan;

class ShippingPlanController extends Controller
{
    public function index()
    {
        // Fetch all Destinations
        $destinations = Destination::all();

        // Fetch all Ports with their Cities
        $ports = Port::with('cities')->get();

        // Fetch all existing ShippingPlans and index them by port_destination_city
        $shippingPlans = ShippingPlan::all()->keyBy(function ($item) {
            return "{$item->port_id}_{$item->destination_id}_{$item->city_id}";
        });

        // Structure data: Destinations -> Ports -> Cities with shipping_fee and shipping_plan_id
        $structuredData = $destinations->map(function ($destination) use ($ports, $shippingPlans) {
            return [
                'id' => $destination->id,
                'name' => $destination->name,
                'ports' => $ports->map(function ($port) use ($destination, $shippingPlans) {
                    return [
                        'id' => $port->id,
                        'name' => $port->name,
                        'cities' => $port->cities->map(function ($city) use ($port, $destination, $shippingPlans) {
                            $key = "{$port->id}_{$destination->id}_{$city->id}";
                            if (isset($shippingPlans[$key])) {
                                $shipping_fee = $shippingPlans[$key]->shipping_fee;
                                $shipping_plan_id = $shippingPlans[$key]->id;
                            } else {
                                $shipping_fee = 0;
                                $shipping_plan_id = null;
                            }
                            return [
                                'id' => $city->id,
                                'name' => $city->name,
                                'code' => $city->code,
                                'shipping_fee' => $shipping_fee,
                                'shipping_plan_id' => $shipping_plan_id,
                                'port_id' => $port->id,
                                'destination_id' => $destination->id,
                            ];
                        })
                        ->sortBy([
                            ['code', 'asc'],
                            ['shipping_fee', 'asc'],
                        ])
                        ->values(), // Reindex the collection
                    ];
                }),
            ];
        });
        return inertia('Admin/Transportation/ShippingPlan/Index', [
            'destinations' => $structuredData,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }


    public function updateSingle(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'shipping_plan_id' => ['nullable', 'exists:shipping_plans,id'],
            'port_id' => ['required', 'exists:ports,id'],
            'destination_id' => ['required', 'exists:destinations,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'shipping_fee' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validated['shipping_plan_id']) {
            // Update existing shipping plan
            $shippingPlan = ShippingPlan::find($validated['shipping_plan_id']);


            $shippingPlan->shipping_fee = $validated['shipping_fee'];
            $shippingPlan->save();

            return back()->with( 'success', 'تم تعديل سعر الشحن بنجاح.',);

        } else {
            // Create new shipping plan

            $shippingPlan = ShippingPlan::create([
                'port_id' => $validated['port_id'],
                'destination_id' => $validated['destination_id'],
                'city_id' => $validated['city_id'],
                'shipping_fee' => $validated['shipping_fee'],
            ]);

            return back()->with( 'success', 'تم انشاء سعر الشحن بنجاح .',);

        }
    }



    public function show()
    {
        // Fetch all Destinations
        $destinations = Destination::all();

        // Fetch all Ports with their Cities
        $ports = Port::with('cities')->get();

        // Fetch all existing ShippingPlans and index them by port_destination_city
        $shippingPlans = ShippingPlan::all()->keyBy(function ($item) {
            return "{$item->port_id}_{$item->destination_id}_{$item->city_id}";
        });

        // Structure data: Destinations → Ports → Cities with shipping_fee
        $structuredData = $destinations->map(function ($destination) use ($ports, $shippingPlans) {
            return [
                'id' => $destination->id,
                'name' => $destination->name,
                'ports' => $ports->map(function ($port) use ($destination, $shippingPlans) {
                    return [
                        'id' => $port->id,
                        'name' => $port->name,
                        'cities' => $port->cities->map(function ($city) use ($port, $destination, $shippingPlans) {
                            $key = "{$port->id}_{$destination->id}_{$city->id}";
                            if (isset($shippingPlans[$key])) {
                                $shipping_fee = $shippingPlans[$key]->shipping_fee;
                            } else {
                                $shipping_fee = 0;
                            }
                            return [
                                'id' => $city->id,
                                'name' => $city->name,
                                'code' => $city->code,
                                'shipping_fee' => $shipping_fee,
                                'port_id' => $port->id,
                                'destination_id' => $destination->id,
                            ];
                        })
                        ->sortBy([
                            ['code', 'asc'],
                            ['shipping_fee', 'asc'],
                        ])
                        ->values(),
                    ];
                }),
            ];
        });

        return inertia('Customer/Transportation/ShippingPlan/Index', [ // Note the different path
            'destinations' => $structuredData,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }



}
