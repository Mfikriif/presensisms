<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\pengajuan_izin;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : (object)[],
            'flash' => [
                'success' => fn () => $request->session()->get('success')
            ],
            'izinSakit' => [
                'izin' => pengajuan_izin::where('status', 'i')->where('status_approved', '0')->get(),
                'sakit' => pengajuan_izin::where('status', 's')->where('status_approved', '0')->get(),
            ],

        ]);
    }
}
