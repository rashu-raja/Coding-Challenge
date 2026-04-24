<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage     = min((int) $request->query('per_page', 10), 100);
        $search      = $request->query('search', '');
        $sortBy      = in_array($request->query('sort_by'), ['name', 'email', 'designation', 'department', 'created_at'])
            ? $request->query('sort_by') : 'name';
        $sortDir     = $request->query('sort_dir', 'asc') === 'desc' ? 'desc' : 'asc';
        $designation = $request->query('designation', '');
        $department  = $request->query('department', '');

        $users = User::with('userPictures')
            ->when($search, fn($q) => $q->where(
                fn($q2) => $q2
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
            ))
            ->when($designation, fn($q) => $q->where('designation', $designation))
            ->when($department,  fn($q) => $q->where('department', $department))
            ->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $users->items(),
            'meta'    => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'per_page'     => $users->perPage(),
                'total'        => $users->total(),
            ]
        ]);
    }

    /**
     * Return distinct designations from users table.
     */
    public function designations()
    {
        $designations = Designation::select('designation')->get();
        return response()->json(['data' => $designations]);
    }

    /**
     * Return distinct departments from users table.
     */
    public function departments()
    {
        $departments = Department::select('department')->get();


        return response()->json(['data' => $departments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('userPictures');

        return response()->json([
            'data' => [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'phone'         => $user->phone,
                'designation'   => $user->designation,
                'department'    => $user->department,
                'status'        => $user->status,
                'created_at'    => $user->created_at,
                'user_pictures' => $user->userPictures->map(fn($pic) => [
                    'id'  => $pic->id,
                    'path' => $pic->path,
                ]),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated.',
            'status'  => $user->status,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'data' => $user->load('userPictures')
        ]);
    }
}
