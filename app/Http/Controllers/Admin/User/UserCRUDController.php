<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\UserCRUD\StoreUserRequest;
use App\Http\Requests\Admin\User\UserCRUD\UpdateUserRequest;
use App\Http\Resources\Admin\User\UserCRUDResource;
use App\Models\Admin\Box\Box;
use App\Models\Admin\Users\Accountant\Accountant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UserCRUDController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::whereDoesntHave('roles', function ($q) {$q->where('name', 'customer'); });

        $roles = Role::whereNotIn('name', ['customer'])->get();

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query->paginate(25)->onEachSide(1);

        $boxes = Box::all();

        return inertia("Admin/User/UserCURD/Index", [
            "users" => UserCRUDResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'roles' => $roles,
            'boxes' => $boxes,
            'danger' => session('danger'),
            'success' => session('success'),


        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {

        $data = $request->validated();
        $data['email_verified_at'] = time();
        $data['password'] = bcrypt($data['password']);
        $user= User::create($data);

        if (isset($data['role'])) {
        $role = Role::findById($data['role']);
        $user->assignRole($role);
        }

        if($data['role'] == 4){
            Accountant::create([
                'user_id' => $user->id,
                'box_id' => $data['box_id']
            ]);
        }
        return back()->with('success', "تم انشاء المستخدم بنجاح");

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // Prevent updating the admin user (id == 1)
        if ($user->id == 1) {
            return back();
        }

        $data = $request->validated();
        $password = $data['password'] ?? null;

        // Hash the password if provided
        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }

        // Update the user role if it has changed
        if (isset($data['role'])) {
            $role = Role::findById($data['role']);
            $user->syncRoles([$role]);

            // Check if the user is being assigned the "Accountant" role
            if ($data['role'] == 4) {
                // Create an accountant profile if it doesn't exist
                if (!$user->accountant) {
                    Accountant::create([
                        'user_id' => $user->id,
                        'box_id' => $data['box_id'],
                    ]);
                } else {
                    // If already an accountant, update the box_id
                    $user->accountant->update([
                        'box_id' => $data['box_id'],
                    ]);
                }
            } else {
                // If the role is no longer "Accountant", delete the accountant profile if it exists
                if ($user->accountant) {
                    $user->accountant->delete();
                }
            }
        }

        // Update user details
        $user->update($data);

        // Return the success message and redirect
        return back()->with('success', "تم تحديث المستخدم بنجاح");
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting the admin user (id == 1)
        if ($user->id == 1) {
            return back()->with('error', 'لا يمكن حذف المستخدم الأساسي');
        }

        $associations = [
            'box_transactions' => [
                'created' => $user->createdBoxTransactions()->count(),
                'updated' => $user->updatedBoxTransactions()->count(),
            ],
            'cars' => [
                'created' => $user->createdCars()->count(),
                'updated' => $user->updatedCars()->count(),
            ],
            'customer_credits' => [
                'created' => $user->createdCustomerCredits()->count(),
                'updated' => $user->updatedCustomerCredits()->count(),
            ],
            'box_transfers' => [
                'created' => $user->createdBoxTransfers()->count(),
                'updated' => $user->updatedBoxTransfers()->count(),
            ],
        ];

        $totalAssociations = array_sum(array_map('array_sum', $associations));

        if ($totalAssociations > 0) {
            $message = "لا يمكن حذف هذا المستخدم. لديه ارتباطات في النظام:";
            foreach ($associations as $table => $counts) {
                $total = $counts['created'] + $counts['updated'];
                if ($total > 0) {
                    $message .= "\n- {$table}: {$total} ({$counts['created']} تم إنشاؤها، {$counts['updated']} تم تحديثها)";
                }
            }
            return back()->with('danger', $message);
        }

        try {
            DB::transaction(function () use ($user) {
                if ($user->hasRole('Accountant') && $user->accountant) {
                    $user->accountant->delete();
                }
                $user->delete();
            });

            return to_route('user.index')->with('success', "تم حذف المستخدم بنجاح");
        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء محاولة حذف المستخدم');
        }
    }




}
