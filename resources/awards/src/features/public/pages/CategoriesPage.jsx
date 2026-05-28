import React from 'react';
import { Card } from '../../../shared/components/ui/Card';
import { useCategoriesQuery } from '../../../services/api/platformApi';

export function CategoriesPage() {
    const { data } = useCategoriesQuery();
    const categories = data?.data ?? [];

    return (
        <section>
            <h1>Award Categories</h1>
            <div className="grid-three">
                {categories.map((category) => (
                    <Card key={category.id} title={category.name}>
                        <p>{category.description}</p>
                        <small>Form: {category.pricing?.form_type ?? 'free'}</small>
                    </Card>
                ))}
            </div>
        </section>
    );
}
