<?php

namespace App\Http\Controllers\Admin\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customer\StoreCustomerRequest;
use App\Http\Requests\Admin\Customer\UpdateCustomerRequest;
use App\Http\Resources\Admin\Customer\CustomerResource;
use App\Models\Admin\Box\BoxTransaction;
use App\Models\Admin\Customer\Customer;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\SiteSetting\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        if (request("user_name")) {
            $query->where("user_name", "like", "%" . request("user_name") . "%");
        }
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        if (request("customer_company")) {
                $query->whereHas('customer', function($q) {
                    $q->where("customer_company", "like", "%" . request("customer_company") . "%");
                });
        }

        $users = $query->with(['customer', 'customer.createdBy', 'customer.updatedBy'])->paginate(25)->onEachSide(1);

        return inertia("Admin/Customer/Index", [
            "users" => CustomerResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger'=>session('danger'),
            'whatsapp_redirect' => session('whatsapp_redirect'),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();

        DB::beginTransaction();
        try {

        $data['email_verified_at'] = now();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        $user->assignRole('customer');

        Customer::create([
            'user_id' => $user->id,
            'customer_company'=>$data['customer_company'],
            "created_by" => Auth()->user()->id
        ]);

        $site_name = Setting::where('name', 'site_name')->value('value');
        $site_url = url('/'); // Get the live site URL


        $whatsappNumber = $data['whatsapp'];
        $message = "عميلنا العزيز، يمكنك الدخول لنظام \"{$site_name}\" عن طريق الرابط \"{$site_url}\" باستخدام معلومات الدخول التالية: اسم المستخدم \"{$user->user_name}\" وكلمة المرور \"{$request->password}\"، علماً بأن البريد الإلكتروني المعتمد هو \"{$user->email}\".";




        $customer_company = $data['customer_company'];

        //دائن ومدين
        $currentTimestamp = Carbon::now();

        if($data['added_credit'] != 0){

            CustomerCredit::create([
                'user_id'=> $user->id,
                'box_id' => 1,
                'added_credit' => $data['added_credit'],
                'description' => ' رصيد افتتاحي دائن بقيمة ' . $data['added_credit'] . " $ " . ' إلى العميل ' . $customer_company . " بتاريخ " . date('Y-m-d'),
                'created_by' => Auth::user()->id,
                'created_at' => $currentTimestamp
            ]);
            BoxTransaction::create([
                    'box_id' => 1,
                    'income' => $data['added_credit'],
                    'description' => ' رصيد افتتاحي دائن بقيمة ' . $data['added_credit'] . " $ " . ' إلى العميل ' . $customer_company . " بتاريخ " . date('Y-m-d'),
                    'created_by' => Auth::id(),
                ]);
        }


        if($data['used_credit'] != 0){
            CustomerCredit::create([
                'user_id'=> $user->id,
                'box_id' => null,
                'used_credit' => $data['used_credit'],
                'description' => ' رصيد افتتاحي مدين بقيمة ' . $data['used_credit'] . " $ ". ' من العميل ' . $customer_company . " بتاريخ " . date('Y-m-d'),
                'created_by' => Auth::user()->id,
                'created_at' => $currentTimestamp->copy()->addSecond(),

            ]);

        }






        DB::commit();

        return back()->with('success', "تم انشاء العميل بنجاح")
            ->with('whatsapp_redirect', 'https://wa.me/' . $whatsappNumber . '?text=' . urlencode($message));
        } catch (\Exception $e) {

            DB::rollBack();


            return back()->with('danger', 'حدث خطأ : ' . $e->getMessage());
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, User $customer)
    {
        $data = $request->validated();

        DB::beginTransaction();
        try {

        // Handle WhatsApp message redirection only if the password is updated
        $whatsapp_redirect = null;

        // Check if the password is being updated
        if (isset($data['password']) && $data['password']) {
            $data['password'] = bcrypt($data['password']);

            $site_name = Setting::where('name', 'site_name')->value('value');
            $site_url = url('/');
            $message = "مرحباً، يمكنك الدخول لنظام \"{$site_name}\" عن طريق الرابط \"{$site_url}\" باستخدام معلومات الدخول التالية: اسم المستخدم \"{$customer->user_name}\" وكلمة المرور \"{$request->password}\"، علماً بأن البريد الإلكتروني المعتمد هو \"{$customer->email}\".";

            // Create the WhatsApp message redirect URL
            $whatsapp_redirect = 'https://wa.me/' . $customer->whatsapp . '?text=' . urlencode($message);
        } else {
            unset($data['password']);
        }

        // Handle role change if provided
        if (isset($data['role'])) {
            $role = Role::findById($data['role']);
            $customer->syncRoles([$role]);
        }

        // Update the customer details
        $customer->update($data);
        if(isset($data['customer_company'])){
        $customer->customer()->update([
                'customer_company'=>$data['customer_company'],
                'updated_by' => Auth()->user()->id
                    ]);
        }
        // If password was updated, include the WhatsApp redirect in the response
        if ($whatsapp_redirect) {
            return back()->with('success', 'تم تحديث العميل بنجاح')
                ->with('whatsapp_redirect', $whatsapp_redirect);
        }
            DB::commit();

        // Return success message without WhatsApp redirect for other updates
        return back()->with('success', 'تم تحديث العميل بنجاح');

          } catch (\Exception $e) {

            DB::rollBack();

            return back()->with('danger', 'حدث خطأ : ' . $e->getMessage());
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customer)
    {
        // Check if the customer has associated cars
        if ($customer->cars()->count() > 0) {
            return back()->with('danger', 'لا يمكن حذف العميل لأنه مرتبط بسيارات.');
        }

        // Check if the customer has associated payment bills
        if ($customer->payments()->count() > 0) {
            return back()->with('danger', 'لا يمكن حذف العميل لأنه مرتبط بمدفوعات.');
        }

        if ($customer->credits()->count() > 0) {
            return back()->with('danger', 'لا يمكن حذف العميل لأنه مرتبط بأرصدة.');
        }

        $customer->delete();


        return back()->with('success', "تم حذف العميل بنجاح");
    }

}
