#!/bin/bash

# STU News Image Generator Script
# Generates diverse hero images for Shantou University news site
# Sizes: 1200x630 (OG banner), 800x450 (card thumbnail), 400x300 (mobile/list)

API_URL="https://api.webagentloop.com/v1/images/generations"
OUTPUT_DIR="/Users/xiancongrong/Code/STU/news/public/images"
AUTH_HEADER="Authorization: Bearer $NEW_API_KEY"
CONTENT_TYPE="Content-Type: application/json"
MODEL='"model":"agnes-image-2.0-flash"'

download_image() {
  local filename="$1"
  local size="$2"
  local prompt="$3"
  
  local response
  response=$(curl -s -X POST "$API_URL" \
    -H "$AUTH_HEADER" \
    -H "$CONTENT_TYPE" \
    -d "{\"model\":\"agnes-image-2.1-flash\",\"prompt\":\"$prompt\",\"size\":\"$size\",\"n\":1}")
  
  local url
  url=$(echo "$response" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$url" ]; then
    curl -s -o "$OUTPUT_DIR/$filename" "$url"
    if [ $? -eq 0 ]; then
      local size_bytes
      size_bytes=$(stat -f%z "$OUTPUT_DIR/$filename" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$filename" 2>/dev/null)
      if [ "$size_bytes" -gt 1000 ]; then
        echo "  ✓ $filename ($(du -h "$OUTPUT_DIR/$filename" | cut -f1))"
        return 0
      fi
    fi
    echo "  ✗ Download failed for $filename"
    return 1
  else
    echo "  ✗ No URL returned for $filename"
    return 1
  fi
}

echo "=========================================="
echo "STU News Image Generator"
echo "=========================================="
echo ""

# Counters
success=0
fail=0

generate() {
  local filename="$1"
  local size="$2"
  local prompt="$3"
  echo -n "Generating $filename ($size)... "
  if download_image "$filename" "$size" "$prompt"; then
    ((success++))
  else
    ((fail++))
  fi
}

# ==========================================
# Section 1: Campus Scenery (校园风光)
# ==========================================
echo "[1/8] Campus Scenery..."
generate "campus/main-gate-sunset.jpg" "1200x630" "A grand university main gate entrance at golden hour sunset, modern architecture with tropical landscaping, palm trees and blooming kanakavalli flowers, warm orange and gold lighting, professional architectural photography, wide angle"
generate "campus/knowledge-arch-twilight.jpg" "1200x630" "A modern university knowledge arch landmark at twilight, blue sky gradient, illuminated lights on the structure, students walking underneath, tropical campus atmosphere, cinematic composition"
generate "campus/campus-lake-bridge.jpg" "1200x630" "A serene campus lake with a stone bridge, surrounded by lush tropical vegetation and flowering trees, morning mist on the water surface, peaceful university atmosphere, soft natural lighting, landscape photography"
generate "campus/dormitory-exterior.jpg" "1200x630" "Modern university dormitory building exterior, clean white architecture with balconies, surrounded by green lawns and tropical plants, bright sunny day, student life atmosphere, wide angle shot"
generate "campus/campus-path-trees.jpg" "1200x630" "A tree-lined pathway on a university campus, tall tropical trees forming a green canopy overhead, students walking along the path, dappled sunlight filtering through leaves, peaceful academic atmosphere"
generate "campus/aerial-campus-view.jpg" "800x450" "Aerial drone view of a modern university campus, green gardens and flower beds between buildings, a lake in the center, tropical island setting, bright daylight, wide panoramic shot"
generate "campus/campus-night-lights.jpg" "800x450" "University campus at night, illuminated buildings with warm yellow lights, reflections on a nearby lake, starry sky, romantic academic atmosphere, long exposure photography"
generate "campus/spring-campus-flowers.jpg" "400x300" "Spring campus scenery, vibrant kanakavalli flowers (golden trumpet vines) covering campus buildings, lush green foliage, bright sunny weather, tropical garden atmosphere"

# ==========================================
# Section 2: Academic & Research (学术研究)
# ==========================================
echo "[2/8] Academic & Research..."
generate "academic/modern-classroom.jpg" "1200x630" "A modern university lecture hall with tiered seating, students taking notes, large projection screen displaying academic content, bright natural lighting, professional educational photography"
generate "academic/professor-lecture.jpg" "1200x630" "A university professor giving a lecture, standing at a podium with presentation slides behind, attentive students in the foreground, academic conference atmosphere, warm indoor lighting"
generate "academic/science-lab-research.jpg" "1200x630" "A modern science laboratory, researchers in white lab coats working with advanced equipment, microscopes and glassware on clean benches, bright sterile lighting, scientific research atmosphere"
generate "academic/biomedical-research.jpg" "1200x630" "Biomedical research laboratory, scientists examining samples under microscopes, modern medical research equipment, clean white and blue tones, professional scientific photography"
generate "academic/library-study-area.jpg" "1200x630" "A spacious university library study area, rows of wooden desks with students studying quietly, bookshelves in the background, warm ambient lighting, peaceful academic atmosphere"
generate "academic/group-discussion.jpg" "800x450" "University students collaborating around a round table in a modern study room, laptops and notebooks open, professor guiding discussion, bright natural light from large windows"
generate "academic/research-presentation.jpg" "800x450" "Academic research presentation in a university seminar room, student presenting at a whiteboard with charts and graphs, audience of professors and students taking notes"
generate "academic/chemistry-experiment.jpg" "400x300" "Chemistry laboratory experiment, colorful solutions in test tubes and beakers, student researcher taking notes, close-up shot with shallow depth of field, scientific atmosphere"

# ==========================================
# Section 3: Graduation (毕业季)
# ==========================================
echo "[3/8] Graduation..."
generate "graduation/ceremony-stage.jpg" "1200x630" "University graduation ceremony on a grand stage, students in black academic gowns receiving diplomas, dean handing certificates, proud parents in audience, golden hour sunlight through large windows"
generate "graduation/mortarboard-throw.jpg" "1200x630" "Group of graduating students in black gowns throwing mortarboards into the air simultaneously, joyful celebration, golden sunset backlight, dynamic action shot, wide angle composition"
generate "graduation/campus-portrait.jpg" "1200x630" "Individual graduate student in academic gown standing alone on campus, holding diploma folder, beautiful university building in background, golden hour portrait photography, emotional atmosphere"
generate "graduation/friends-celebration.jpg" "800x450" "Group of diverse graduating friends hugging and celebrating on university lawn, caps and diplomas in hand, confetti falling, bright sunny day, candid joyful moment"
generate "graduation/family-photo.jpg" "800x450" "Graduate student posing for family photo on campus, parents and siblings smiling beside them in academic gown, university landmark building in background, warm family moment"
generate "graduation/empty-graduation-hall.jpg" "400x300" "An empty university graduation hall after ceremony, rows of chairs, scattered mortarboards on floor, sunlight streaming through windows, nostalgic and reflective mood"
generate "graduation/diploma-closeup.jpg" "400x300" "Close-up of a university diploma certificate with wax seal on a wooden desk, academic gown sleeve visible, pen and glasses beside it, warm bokeh background"
generate "graduation/batch-photo.jpg" "1200x630" "Large group class photo of graduating students arranged on university stadium steps, all wearing academic gowns, waving at camera, sunny day, wide angle team shot"

# ==========================================
# Section 4: Student Activities (学生活动)
# ==========================================
echo "[4/8] Student Activities..."
generate "student/cultural-festival.jpg" "1200x630" "University cultural festival outdoor stage, students performing traditional Chinese dance in colorful costumes, vibrant crowd watching, festive decorations and lanterns, evening atmosphere with stage lighting"
generate "student/music-concert.jpg" "1200x630" "University wind band concert in an outdoor amphitheater, student musicians playing brass and woodwind instruments, conductor leading, audience seated on grass, golden afternoon light"
generate "student/art-exhibition.jpg" "1200x630" "Student art exhibition in a modern gallery space, paintings and sculptures displayed on white walls, visitors admiring artwork, clean minimalist aesthetic, professional exhibition photography"
generate "student/debate-competition.jpg" "800x450" "University debate competition, students at podiums arguing passionately, judge panel in front, audience clapping, formal academic setting with university banners"
generate "student/sports-competition.jpg" "800x450" "University basketball game in action, players dribbling and shooting, energetic crowd cheering, indoor gymnasium with bright overhead lighting, dynamic sports photography"
generate "student/volunteer-activity.jpg" "400x300" "University volunteers in red vests planting trees on campus, students digging soil and watering saplings, sunny day, community service atmosphere, candid documentary style"
generate "student/flea-market.jpg" "400x300" "Outdoor flea market at university, students selling secondhand books and items at makeshift stalls, browsing and bargaining, casual friendly atmosphere, natural daylight"
generate "student/club-booth.jpg" "1200x630" "University club recruitment fair, colorful booths with student organizations promoting activities, students signing up and getting free merchandise, lively campus square, bright sunny day"

# ==========================================
# Section 5: Traditional Culture (传统文化)
# ==========================================
echo "[5/8] Traditional Culture..."
generate "culture/chinese-calligraphy.jpg" "1200x630" "Chinese calligraphy art class, student practicing brush writing on rice paper, ink brushes and grinding stone on wooden table, traditional Chinese art supplies, warm studio lighting, close-up composition"
generate "culture/seal-carving.jpg" "1200x630" "Traditional Chinese seal carving workshop, hands using carving tools on red stone seals, finished seals with intricate characters displayed, wooden workbench with tools, focused artisan atmosphere"
generate "culture/zongzi-making.jpg" "1200x630" "Dragon Boat Festival zongzi making activity, students wrapping bamboo leaf sticky rice dumplings together, traditional technique demonstration, communal kitchen setting, warm cultural atmosphere"
generate "culture/incense-pouch.jpg" "800x450" "Traditional Chinese incense pouch craft, hands filling embroidered silk pouches with aromatic herbs, dried mugwort and sachet materials spread on table, Dragon Boat Festival theme"
generate "culture/paper-cutting.jpg" "800x450" "Chinese paper cutting art, student carefully cutting intricate patterns from red paper, finished paper cuttings displayed on wall, traditional folk art atmosphere, bright clean workspace"
generate "culture/tea-ceremony.jpg" "400x300" "Traditional Chinese tea ceremony setup, ceramic teapot and cups on wooden tray, steam rising from hot tea, zen-like peaceful atmosphere, soft natural lighting"
generate "culture/flower-arrangement.jpg" "400x300" "Chinese floral arrangement (ikebana/chado style), elegant branches and flowers in a ceramic vase, minimalist aesthetic, soft diffused lighting, meditative atmosphere"
generate "culture/festival-lanterns.jpg" "1200x630" "Mid-Autumn Festival lanterns hanging on campus, colorful paper lanterns with Chinese characters, string lights creating warm glow, students admiring displays, festive evening atmosphere"

# ==========================================
# Section 6: Sports & Fitness (体育运动)
# ==========================================
echo "[6/8] Sports & Fitness..."
generate "sports/dragon-boat-racing.jpg" "1200x630" "Chinese dragon boat racing team paddling in unison on calm water, traditional ornate dragon boat with red and gold colors, summer sun reflecting on lake, dynamic action photography, wide angle"
generate "sports/track-field.jpg" "1200x630" "University athletics track at sunrise, empty red running lanes stretching into distance, track and field equipment in background, golden morning light, sports venue photography"
generate "sports/basketball-game.jpg" "800x450" "University basketball tournament game, player dunking the ball, opponents defending, packed bleachers with cheering fans, indoor arena lighting, dramatic sports moment"
generate "sports/tennis-court.jpg" "800x450" "Tennis court at university, player serving the ball, green hard court surface, net in foreground, bright sunny day, sports action shot"
generate "sports/swimming-pool.jpg" "400x300" "University swimming pool, swimmer doing freestyle stroke, blue water with lane ropes, indoor natatorium with bright lighting, athletic competition atmosphere"
generate "sports/yoga-grass.jpg" "400x300" "Students doing yoga on university campus lawn, peaceful morning exercise, green grass and trees in background, soft dawn light, wellness and mindfulness theme"
generate "sports/fitness-center.jpg" "1200x630" "Modern university fitness center interior, students using treadmills and weight machines, clean industrial design with large windows, energetic workout atmosphere"
generate "sports/volleyball-beach.jpg" "800x450" "Beach volleyball on campus waterfront, players jumping to spike the ball, sandy court with blue water background, tropical summer sports atmosphere, dynamic action shot"

# ==========================================
# Section 7: Library & Learning (图书馆学习)
# ==========================================
echo "[7/8] Library & Learning..."
generate "library/modern-library-exterior.jpg" "1200x630" "Modern university library building exterior, glass and steel architecture, students entering with backpacks, landscaped gardens around, bright sunny day, architectural photography"
generate "library/quiet-reading-room.jpg" "1200x630" "Quiet university reading room, students studying individually at long wooden tables, floor-to-ceiling bookshelves, warm pendant lighting, peaceful scholarly atmosphere"
generate "library/computer-lab.jpg" "800x450" "University computer lab, students working on desktop computers, rows of screens with academic websites, modern educational technology, bright fluorescent lighting"
generate "library/bookshelf-corridor.jpg" "800x450" "Library bookshelf corridor, endless rows of books on both sides, student reading a book leaning against shelf, warm amber lighting, sense of infinite knowledge"
generate "library/study-desk-setup.jpg" "400x300" "Student study desk setup, open textbook, laptop, coffee cup, and notebook on wooden desk, window with campus view in background, cozy study atmosphere"
generate "library/electronic-resource.jpg" "400x300" "Electronic resource area in university library, students using public computers and tablets, digital catalog screens, modern self-service book borrowing machine"
generate "library/night-study.jpg" "1200x630" "University library at night, single student studying alone at a desk by window, city lights visible outside, warm lamp on desk, focused dedication atmosphere, cinematic lighting"
generate "library/group-study-room.jpg" "800x450" "Group study room in library, four students discussing around a table with textbooks and laptops, whiteboard with notes on wall, collaborative learning atmosphere"

# ==========================================
# Section 8: Community & Service (社区服务)
# ==========================================
echo "[8/8] Community & Service..."
generate "community/blood-donation.jpg" "1200x630" "University blood donation event, students sitting in comfortable chairs donating blood, nurses preparing equipment, red ribbon decorations, community service atmosphere, warm professional lighting"
generate "community/food-drive.jpg" "1200x630" "Volunteer food distribution event on campus, students organizing boxes of food and supplies, community members receiving donations, charity atmosphere, bright daylight"
generate "community/environmental-clean.jpg" "800x450" "Campus environmental cleanup volunteer activity, students picking up litter along waterfront path, recycling bags, teamwork spirit, sunny day, community service"
generate "community/elderly-visiting.jpg" "800x450" "University students visiting elderly residents at a nursing home, young people chatting and performing for seniors, intergenerational bonding, warm indoor setting"
generate "community/teaching-volunteer.jpg" "400x300" "University students teaching children in rural area, classroom with colorful chalkboard drawings, student teacher pointing at map, educational volunteer atmosphere"
generate "community/oral-health.jpg" "400x300" "Community oral health clinic, dental students providing free teeth checkups to local children, bright clinical setting, healthcare education theme"
generate "community/rural-research.jpg" "1200x630" "University students conducting rural field research, interviewing local farmers in village, notebooks and recording devices, authentic documentary photography, countryside setting"
generate "community/recycling.jpg" "800x450" "University recycling program booth, students sorting recyclable materials, educational signage about sustainability, green campus initiative, bright informative display"

# ==========================================
# Additional: General/Abstract backgrounds
# ==========================================
echo ""
echo "Additional backgrounds..."
generate "general/gradient-gold.jpg" "1200x630" "Abstract gradient background in warm gold and cream colors, smooth color transition from deep amber to light beige, subtle texture overlay, professional design background, clean minimal aesthetic"
generate "general/bokeh-lights.jpg" "1200x630" "Abstract bokeh background with warm golden circular light blurs on dark brown background, elegant and sophisticated, suitable for overlay text, professional design"
generate "general/geometric-pattern.jpg" "800x450" "Geometric pattern background with triangular shapes in shades of gold, brown, and cream, modern abstract design, clean corporate aesthetic, subtle shadow effects"
generate "general/watercolor-texture.jpg" "800x450" "Watercolor texture background in warm earth tones, soft blue and gold washes blending together, artistic paper texture visible, elegant creative background"
generate "general/minimal-lines.jpg" "400x300" "Minimal background with thin gold lines on cream colored surface, geometric arrangement, clean and professional, suitable for news website backgrounds"
generate "general/campus-blur.jpg" "1200x630" "Blurred university campus background, out-of-focus green trees and building silhouettes, warm golden color cast, soft atmospheric background for text overlay"

echo ""
echo "=========================================="
echo "Done! Generated: $success succeeded, $fail failed"
echo "Images saved to: $OUTPUT_DIR"
echo "=========================================="
