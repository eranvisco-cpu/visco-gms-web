const SUPABASE_URL = 'https://tqrvcwkulrdqtbkyyvks.supabase.co';
const SUPABASE_KEY = 'sb_publishable_EKSG2uUBWxrrFTtzKcg0AA_i2IWdaRo';

let supabaseClient;
let allVehicles = [];  // Store all vehicles for filtering

// Wait for Supabase to load
if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error('Supabase library not loaded');
}

// =====================================================
// DELETE VEHICLE FUNCTION
// =====================================================
async function deleteVehicle(id) {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this vehicle record? This action cannot be undone.')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) {
            alert(`Error deleting vehicle: ${error.message}`);
            console.error('Delete error:', error);
            return;
        }

        // Show success message
        alert('Vehicle record deleted successfully!');
        
        // Refresh the vehicle list
        fetchVehicles();
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

async function fetchVehicles() {
    const { data, error } = await supabaseClient
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    allVehicles = data;  // Store all vehicles
    renderVehicles(allVehicles);  // Render all vehicles initially
}

// =====================================================
// RENDER VEHICLES FUNCTION
// =====================================================
function renderVehicles(vehicles) {
    const grid = document.getElementById('vehicle-grid');
    if(!grid) return;
    
    grid.innerHTML = '';
    
    if(vehicles.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">No vehicles found.</p>';
        return;
    }

    vehicles.forEach(vehicle => {
        const vehicleImage = vehicle.image_url ? vehicle.image_url : 'https://via.placeholder.com/400x300?text=No+Image';

        const card = `
            <div class="card shadow-lg bg-[#1e1e1e] rounded-xl overflow-hidden mb-4 border border-gray-800 cursor-pointer hover:shadow-2xl hover:border-yellow-500/30 transition duration-300" onclick="window.location.href='view-car.html?id=${vehicle.id}'">
                <img src="${vehicleImage}" class="w-full h-52 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                <div class="p-4">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h2 class="text-xl font-bold text-yellow-500 uppercase">${vehicle.plate_number}</h2>
                            <p class="text-gray-400 text-sm">${vehicle.car_model || 'Unknown Model'}</p>
                        </div>
                        <span class="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                            ${vehicle.status || 'INSPECTION'}
                        </span>
                    </div>
                    <div class="flex justify-between items-center border-t border-gray-800 pt-3">
                        <span class="text-gray-500 text-[10px]">${new Date(vehicle.created_at).toLocaleDateString()}</span>
                        <button onclick="event.stopPropagation(); window.location.href='view-car.html?id=${vehicle.id}'" class="text-yellow-500 text-sm font-semibold hover:underline">VIEW DETAILS</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// =====================================================
// SEARCH FUNCTIONALITY
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if(searchTerm === '') {
                // Show all vehicles if search is empty
                renderVehicles(allVehicles);
            } else {
                // Filter vehicles by plate number or model
                const filtered = allVehicles.filter(vehicle => {
                    const plateMatch = vehicle.plate_number && vehicle.plate_number.toLowerCase().includes(searchTerm);
                    const modelMatch = vehicle.car_model && vehicle.car_model.toLowerCase().includes(searchTerm);
                    return plateMatch || modelMatch;
                });
                renderVehicles(filtered);
            }
        });
    }
});

// Only fetch vehicles if Supabase client is initialized
if (supabaseClient) {
    fetchVehicles();
} else {
    console.warn('Supabase client not initialized. Waiting for library to load...');
}