const ProjectFilter = ({ activeFilter, setFilter }) => {
    const filters = [
        { id: 'all', label: 'All Projects' },
        { id: 'ongoing', label: 'Ongoing' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'completed', label: 'Completed' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filterItem) => (
                <button
                    key={filterItem.id}
                    onClick={() => setFilter(filterItem.id)}
                    className={`px-6 py-2 rounded-full transition ${activeFilter === filterItem.id
                            ? 'bg-[#c20e35] text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                >
                    {filterItem.label}
                </button>
            ))}
        </div>
    );
};

export default ProjectFilter;