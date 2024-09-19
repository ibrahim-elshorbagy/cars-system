<?php

namespace App\Http\Controllers\Admin\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customer\StoreCustomerRequest;
use App\Http\Requests\Admin\Customer\UpdateCustomerRequest;
use App\Http\Resources\Admin\Customer\CustomerResource;
use App\Http\Resources\Admin\User\UserCRUDResource;
use App\Models\Customer;
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

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query->with('customer')->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Admin/Customer/Index", [
            "users" => CustomerResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger'=>session('danger')

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Admin/Customer/Create");

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        $phone = $data['phone'] ?? null;
        $address = $data['address'] ?? null;
        unset($data['phone'], $data['address']);

        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        $user->assignRole('customer');

        Customer::create([
            'user_id' => $user->id,
            'phone' => $phone,
            'address' => $address
        ]);

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar'
            ? "تم إنشاء العميل \"{$user->name}\" بنجاح"
            : "Customer \"{$user->name}\" was created successfully";

        return to_route('customer.index')
            ->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $customer)
    {
            $customer->load('customer');

        return inertia('Admin/Customer/Edit', [
            'user' => new CustomerResource($customer),
        ]);
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

        $phone = $data['phone'] ?? null;
        $address = $data['address'] ?? null;
        unset($data['phone'], $data['address']);

        // Update the user details
        $customer->update($data);

        if ($customer->customer) {
            $customer->customer->update([
                'phone' => $phone,
                'address' => $address,
            ]);
        } else {
            Customer::create([
                'user_id' => $customer->id,
                'phone' => $phone,
                'address' => $address,
            ]);
        }

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث العميل \"{$customer->name}\" بنجاح"
            : "Customer \"{$customer->name}\" was updated successfully";

        return to_route('customer.index')
            ->with('success', $message);
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customer)
    {
        $name = $customer->name;
        if ($customer->customer->products->count() > 0) {
        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "لا يمكن العميل \"{$name}\" لان لديه منتجات "
            : "Cannot delete Customer \"{$name}\" because he has products";

        return to_route('customer.index')
            ->with('danger', $message);
        }
        $customer->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف العميل \"{$name}\" بنجاح"
            : "Customer \"{$name}\" was deleted successfully";

        return to_route('customer.index')
            ->with('success', $message);
    }

}
