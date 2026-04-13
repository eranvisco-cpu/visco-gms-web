const SUPABASE_URL = 'https://tqrvcwkulrdqtbkyyvks.supabase.coYOUR_SUPABASE_URL';
const SUPABASE_KEY = 'sb_publishable_EKSG2uUBWxrrFTtzKcg0AA_i2IWdaRo';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchVehicles() {
    const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const grid = document.getElementById('vehicle-grid');
    grid.innerHTML = '';

    data.forEach(vehicle => {
        const card = `
            <div class="card shadow-lg">
                <img src="${vehicle.image_url || 'https://via.placeholder.com/400x300'}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h2 class="text-xl font-bold uppercase">${vehicle.plate_number}</h2>
                    <p class="text-gray-400">${vehicle.customer_name || 'No Owner'}</p>
                    <p class="text-gray-500 text-sm">${new Date(vehicle.created_at).toLocaleString()}</p>
                    <div class="mt-3 flex justify-between items-center">
                        <span class="text-sm font-medium">01 Inspection</span>
                        <span class="status-pending">${vehicle.payment_status || 'Pending'}</span>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// App එක පටන් ගන්නා විට දත්ත ලබා ගන්න
fetchVehicles();