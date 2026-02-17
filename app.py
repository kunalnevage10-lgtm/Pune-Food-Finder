from flask import Flask, render_template, request, url_for
import json

app = Flask(__name__)

def load_restaurant_data():
    """Loads data from the restaurants.json file."""
    try:
        with open('restaurants.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@app.route('/', methods=['GET', 'POST'])
def index():
    all_restaurants = load_restaurant_data()
    search_query = ""
    selected_cuisine = ""
    selected_location = ""
    
    # Saare unique cuisines aur locations nikalna
    all_cuisines = sorted(list(set(r['cuisine'] for r in all_restaurants)))
    all_locations = sorted(list(set(r['location'] for r in all_restaurants)))
    
    filtered_restaurants = all_restaurants

    if request.method == 'POST':
        # Inputs lena
        search_query = request.form.get('search_term', '').lower()
        selected_cuisine = request.form.get('cuisine_filter', '')
        selected_location = request.form.get('location_filter', '')
        
        # Filtering logic shuru
        if search_query or selected_cuisine or selected_location:
            
            temp_restaurants = all_restaurants
            
            # Filtering by Search Query
            if search_query:
                temp_restaurants = [
                    r for r in temp_restaurants 
                    if search_query in r['name'].lower() 
                    or search_query in r['cuisine'].lower()
                    or search_query in r['location'].lower()
                ]
            
            # Filtering by Cuisine Dropdown
            if selected_cuisine and selected_cuisine != "All":
                temp_restaurants = [
                    r for r in temp_restaurants
                    if r['cuisine'] == selected_cuisine
                ]

            # Filtering by Location Dropdown
            if selected_location and selected_location != "All":
                temp_restaurants = [
                    r for r in temp_restaurants
                    if r['location'] == selected_location
                ]
                
            filtered_restaurants = temp_restaurants

    # Final data ko HTML template mein bhejna
    return render_template('index.html', 
                           restaurants=filtered_restaurants, 
                           all_cuisines=all_cuisines,
                           all_locations=all_locations,
                           search_query=search_query,
                           selected_cuisine=selected_cuisine,
                           selected_location=selected_location)