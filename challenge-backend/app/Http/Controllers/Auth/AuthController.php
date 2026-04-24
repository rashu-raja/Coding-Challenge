<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users,email',
            'phone'            => 'required|max:10',
            'designation'      => 'required|string|max:255',
            'department'       => 'required|string|max:255',
            'password'         => 'required|min:8|confirmed',
            'profile_picture'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'        => $request->name,
            'email'       => $request->email,
            'phone'       => $request->phone,
            'designation' => $request->designation,
            'department'  => $request->department,
            'password'    => Hash::make($request->password),
            'role'        => 'user',
        ]);

        // handle profile picture
        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');

            $user->userPictures()->create([
                'path' => $path,
            ]);
        }


        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success'  => true,
            'message'  => 'Account created successfully.',
            'token'    => $token,
            'user'     => $this->userDetail($user),
            'redirect' => '/',
        ], 201);
    }

    public function logIn(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The provided credentials are incorrect.',
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'token'   => $token,
            'user'    => $this->userDetail($user),
            'redirect' => '/',

        ]);
    }

    public function logOut(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success'  => true,
            'message'  => 'Logged out successfully.',
            'redirect' => '/login',
        ]);
    }

    private function userDetail(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role'  => $user->role,
            'user_pictures' => $user->userPictures,
        ];
    }
}
