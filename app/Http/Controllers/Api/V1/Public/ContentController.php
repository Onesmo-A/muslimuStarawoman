<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\AwardCategory;
use App\Models\Event;
use App\Models\Nominee;
use App\Models\Page;
use App\Models\Post;
use App\Models\Sponsor;
use App\Models\Winner;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class ContentController extends BaseApiController
{
    public function home()
    {
        $data = Cache::remember('public_home', 300, function () {
            return [
                'highlights' => [
                    'active_categories' => AwardCategory::query()->where('is_active', true)->count(),
                    'upcoming_events' => Event::query()->where('status', 'published')->whereDate('event_date', '>=', now())->count(),
                    'nominees' => Nominee::query()->count(),
                ],
                'winners_spotlight' => Schema::hasTable('winners')
                    ? Winner::query()->where('is_published', true)->latest()->take(6)->get()
                    : collect(),
            ];
        });

        return $this->successResponse($data, 'Home content');
    }

    public function categories()
    {
        $categories = Cache::remember('public_categories', 300, function () {
            return AwardCategory::query()->with('pricing')->where('is_active', true)->get();
        });

        return $this->successResponse($categories, 'Categories list');
    }

    public function nominees()
    {
        return $this->successResponse(
            Nominee::query()
                ->with('category:id,name')
                ->withCount(['votes' => fn ($query) => $query->where('status', 'valid')])
                ->where('status', 'active')
                ->latest()
                ->get(),
            'Nominees list'
        );
    }

    public function sponsors()
    {
        return $this->successResponse(Sponsor::query()->where('is_active', true)->get(), 'Sponsors list');
    }

    public function posts()
    {
        return $this->successResponse(Post::query()->where('status', 'published')->latest()->get(), 'Blog posts');
    }

    public function pages()
    {
        return $this->successResponse(Page::query()->where('status', 'published')->get(), 'CMS pages');
    }
}
