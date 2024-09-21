<?php

namespace App\Http\Controllers\Admin\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customer\StoreCustomerRequest;
use App\Http\Requests\Admin\Customer\UpdateCustomerRequest;
use App\Http\Resources\Admin\Customer\CustomerResource;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Spatie\Permission\Models\Role;

class CustomerController extends Controller
{

/*

Full opertions For Customers (add,delete ,update)
*/

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::role('customer');


        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Customer/Index", [
            "users" => CustomerResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger'=>session('danger')

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();


        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        $user->assignRole('customer');


        return back()->with('success', "تم انشاء العميل بنجاح");
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, User $customer)
    {
        $data = $request->validated();

        if (isset($data['password']) && $data['password']) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['role'])) {
            $role = Role::findById($data['role']);
            $customer->syncRoles([$role]);
        }

        // Update the user details
        $customer->update($data);


        return back()->with('success', 'تم تحديث العميل بنجاح');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customer)
    {
        $name = $customer->name;
        // if ($customer->customer->products->count() > 0) {  has cars
        // $locale = session('app_locale', 'en');


        // return back()->with('danger', "لايمكن حذف العميل لديه سيارات");
        // }
        $customer->delete();


        return back()->with('success', "تم حذف العميل بنجاح");
    }

}
