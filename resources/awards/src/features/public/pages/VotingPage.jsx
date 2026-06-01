import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCastVoteMutation, useCategoriesQuery, useNomineesQuery } from '../../../services/api/platformApi';
import { useToast } from '../../../shared/components/ToastProvider';
import { getDeviceFingerprintPayload } from '../../../shared/deviceFingerprint';
import PageLoader from '../../../shared/components/PageLoader';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';
import conceptImage from '../../../assets/mswa-pink-concept.png';


const fallbackCategories = [
    { id: 1, name: 'Learning & Networking Impact' },
    { id: 2, name: 'Islamic Education & Sisterhood' },
    { id: 3, name: 'Business Awards & Recognition' },
    { id: 4, name: 'Charity & Social Support' },
];

const fallbackNominees = [
    {
        id: 101,
        award_category_id: 1,
        business_name: 'Amina Learning Circle',
        contact_person: 'Amina Hassan',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        company_profile: 'Learning circles, mentorship, networking, and modest women empowerment.',
        photo_path: conceptImage,
    },
    {
        id: 102,
        award_category_id: 3,
        business_name: 'Halal Enterprise Hub',
        contact_person: 'Maryam Said',
        city: 'Zanzibar',
        country: 'Tanzania',
        company_profile: 'Ethical entrepreneurship, job creation, and market access.',
        photo_path: conceptImage,
    },
    {
        id: 103,
        award_category_id: 2,
        business_name: 'Quran & Sisterhood Circle',
        contact_person: 'Khadija Ally',
        city: 'Arusha',
        country: 'Tanzania',
        company_profile: 'Islamic education, Quran learning, mentorship, and sisterhood.',
        photo_path: conceptImage,
    },
];

const getNomineeImage = (nominee, index) => {
    if (!nominee.photo_path) {
        return conceptImage;
    }

    if (nominee.photo_path.startsWith('http') || nominee.photo_path.startsWith('/')) {
        return nominee.photo_path;
    }

    return `/storage/${nominee.photo_path}`;
};

export function VotingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategoryId = Number(searchParams.get('category') ?? 0);
    const [votedNomineeId, setVotedNomineeId] = useState(null);
    const [voteFeedback, setVoteFeedback] = useState({ nomineeId: null, message: '', type: '' });
    const [page, setPage] = useState(1);
    const toast = useToast();
    const { data: categoriesData } = useCategoriesQuery();
    const { data: nomineesData, isLoading } = useNomineesQuery();
    const [castVote, { isLoading: isVoting }] = useCastVoteMutation();

    const categories = categoriesData?.data?.length ? categoriesData.data : fallbackCategories;
    const nominees = nomineesData?.data?.length ? nomineesData.data : fallbackNominees;
    const selectedCategory = categories.find((category) => Number(category.id) === selectedCategoryId);
    const totalPublishedNominees = nominees.length;
    
    const isVotingDisabled = selectedCategory && selectedCategory.voting_enabled === false;

    useEffect(() => { setVoteFeedback({ nomineeId: null, message: '', type: '' }); }, [selectedCategoryId]);

    const filteredNominees = useMemo(() => {
        if (!selectedCategoryId) {
            return [];
        }

        return nominees.filter((nominee) => Number(nominee.award_category_id) === selectedCategoryId);
    }, [nominees, selectedCategoryId]);

    const paginatedNominees = useMemo(() => paginate(filteredNominees, page, 6), [filteredNominees, page]);

    const onSelectCategory = (categoryId) => {
        setVotedNomineeId(null);
        setPage(1);
        setSearchParams({ category: String(categoryId) });
    };

    if (isLoading) {
        return <PageLoader />;
    }

    const onVote = async (nominee) => {
        try {
            const fingerprint = await getDeviceFingerprintPayload();
            const result = await castVote({
                award_category_id: selectedCategoryId,
                nominee_id: nominee.id,
                ...fingerprint,
                source: 'web',
            }).unwrap();

            setVotedNomineeId(nominee.id);
            setVoteFeedback({ nomineeId: nominee.id, message: result?.message ?? 'Vote cast successfully!', type: 'success' });
            toast.success(result?.message ?? 'Your vote has been submitted successfully.');
        } catch (error) {
            const errorMsg = error?.data?.message ?? 'Vote failed. Please try again.';
            setVoteFeedback({ nomineeId: nominee.id, message: errorMsg, type: 'error' });
        }
    };

    return (
        <section className="section mswa-page-shell voting-flow-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">{selectedCategory ? 'Public Voting' : 'Voting Categories'}</span>
                    <h1>{selectedCategory ? selectedCategory.name : 'Choose a category to begin voting.'}</h1>
                    <p>Select a category, review the nominees, then submit your vote with one clear tap.</p>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-check-to-slot" aria-hidden="true"></i>
                    <strong>{totalPublishedNominees}</strong>
                    <span>Published nominees</span>
                </div>
            </div>

            <div className="filter-panel">
                <span>Categories</span>
                <div className="voting-category-strip">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            className={Number(category.id) === selectedCategoryId ? 'active' : ''}
                            onClick={() => onSelectCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {!selectedCategoryId ? (
                <div className="empty-state voting-category-shortcut">
                    <Link to="/categories?intent=vote" className="btn btn-outline">Browse All Categories</Link>
                </div>
            ) : null}

            <div className="nominee-grid">
                {paginatedNominees.items.map((nominee, index) => (
                    <article className="nominee-card" key={nominee.id}>
                        <div className="nominee-photo">
                            <img src={getNomineeImage(nominee, index)} alt={nominee.contact_person ?? nominee.business_name} />
                        </div>
                        <div className="nominee-body">
                            <span>{nominee.category?.name ?? selectedCategory?.name ?? 'Nominee'}</span>
                            <h3>{nominee.contact_person ?? nominee.business_name}</h3>
                            <p>{nominee.company_profile ?? nominee.business_name ?? 'Recognized nominee in this category.'}</p>
                            <button
                                type="button"
                                className="btn btn-gold"
                                onClick={() => onVote(nominee)}
                                disabled={isVoting || isVotingDisabled}
                            >
                                {isVoting ? (
                                    <>
                                        <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                                        Voting...
                                    </>
                                ) : (
                                    votedNomineeId === nominee.id ? 'Voted' : 'Vote'
                                )}
                            </button>

                            <div className="vote-status-msg">
                                {isVotingDisabled && (
                                    <p className="is-error">Temporarily Closed</p>
                                )}
                                
                                {voteFeedback.nomineeId === nominee.id && (
                                    <p className={voteFeedback.type === 'success' ? 'is-success' : 'is-error'}>
                                        {voteFeedback.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <Pagination {...paginatedNominees} onPageChange={setPage} />

            {selectedCategoryId && !filteredNominees.length && !isLoading ? (
                <div className="empty-state">
                    <i className="fas fa-user-clock" aria-hidden="true"></i>
                    <span>No nominees have been published for this category yet.</span>
                </div>
            ) : null}
        </section>
    );
}
