async function logLogin(user, supabase) {
  let lat = null, lng = null, city = '', district = '', country = '', full_address = '';
  try {
    const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 }));
    lat = pos.coords.latitude; lng = pos.coords.longitude;
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const d = await r.json();
    if (d.address) {
      city = d.address.city || d.address.town || d.address.village || '';
      district = d.address.state_district || d.address.county || '';
      country = d.address.country || '';
      full_address = d.display_name || '';
    }
  } catch(e) {}
  let ip = '';
  try { ip = (await (await fetch('https://api.ipify.org?format=json')).json()).ip; } catch {}
  await supabase.from('login_logs').insert({
    user_id: user.id, email: user.email, ip,
    latitude: lat, longitude: lng,
    city, district, country, full_address,
    device: navigator.platform, user_agent: navigator.userAgent
  });
}
