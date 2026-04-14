const SUPABASE_URL = 'https://tqrvcwkulrdqtbkyyvks.supabase.coYOUR_SUPABASE_URL'; // ඔයාගේ URL එක මෙතනට දාන්න
const SUPABASE_KEY = 'sb_publishable_EKSG2uUBWxrrFTtzKcg0AA_i2IWdaRo'; // ඔයාගේ Key එක මෙතනට දාන්න
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
    grid.innerHTML = ''; // කලින් තිබුණු දේවල් අයින් කරන්න

    data.forEach(vehicle => {
        // පින්තූරයක් නැත්නම් පෙන්වන්න placeholder එකක් හදනවා
        const vehicleImage = vehicle.image_url ? vehicle.image_url : 'https://via.placeholder.com/400x300?text=No+Image';

        const card = `
            <div class="card shadow-lg bg-[#1e1e1e] rounded-xl overflow-hidden mb-4 border border-gray-800">
                <img src="${vehicleImage}" class="w-full h-52 object-cover">
                <div class="p-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h2 class="text-xl font-bold text-yellow-500 uppercase">${vehicle.plate_number}</h2>
                            <p class="text-gray-400 text-sm">${vehicle.car_model || 'Unknown Model'}</p>
                        </div>
                        <span class="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded">
                            ${vehicle.status || 'PENDING'}
                        </span>
                    </div>
                    <p class="text-gray-500 text-xs mt-2 italic">"${vehicle.customer_voice || 'No remarks'}"</p>
                    <div class="mt-4 flex justify-between items-center border-t border-gray-800 pt-3">
                        <span class="text-gray-500 text-[10px]">${new Date(vehicle.created_at).toLocaleDateString()}</span>
                        <button class="text-yellow-500 text-sm font-semibold hover:underline">VIEW DETAILS</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// පිටුව Load වන විට වාහන ටික පෙන්වන්න
fetchVehicles();