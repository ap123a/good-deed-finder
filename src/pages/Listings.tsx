import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ListingCard, { Listing } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allListings: Listing[] = [
  {
    id: "1",
    title: "Palīdzība dzīvnieku patversmē",
    organization: "Dzīvnieku draugi",
    location: "Rīga",
    category: "Dzīvnieki",
    description: "Meklējam brīvprātīgos, kas palīdzētu rūpēties par kaķiem un suņiem patversmē. Darbs ietver barošanu, pastaigas un spēlēšanos.",
    timeCommitment: "4-8h nedēļā",
    spots: 5,
    isNew: true,
  },
  {
    id: "2",
    title: "Bērnu nometnes vadītājs",
    organization: "Latvijas Skautu un Gaidu organizācija",
    location: "Jūrmala",
    category: "Izglītība",
    description: "Vasaras nometnes organizēšana un vadīšana bērniem vecumā no 8-14 gadiem. Nepieciešama pieredze darbā ar bērniem.",
    timeCommitment: "Pilna laika (2 nedēļas)",
    spots: 10,
    isUrgent: true,
  },
  {
    id: "3",
    title: "Vides sakopšanas talka",
    organization: "Zaļā Latvija",
    location: "Liepāja",
    category: "Vide",
    description: "Piedalies pludmales sakopšanas talkā! Nodrošinām inventāru un ēdināšanu. Aicinām visus dabas draugus.",
    timeCommitment: "1 diena",
    spots: 50,
    isNew: true,
  },
  {
    id: "4",
    title: "Senioru apmeklēšana veco ļaužu namā",
    organization: "Sarkanais Krusts",
    location: "Daugavpils",
    category: "Sociālais darbs",
    description: "Pavadi laiku ar senioriem, izlasi grāmatu, parunājies vai vienkārši uzklausi. Tava klātbūtne var kādam padarīt dienu gaišāku.",
    timeCommitment: "2-4h nedēļā",
    spots: 8,
  },
  {
    id: "5",
    title: "IT konsultants nevalstiskām organizācijām",
    organization: "Tech4Good",
    location: "Tiešsaiste",
    category: "IT",
    description: "Palīdzi NVO ar mājas lapu izveidi, sociālo tīklu pārvaldību un digitālo risinājumu ieviešanu.",
    timeCommitment: "Elastīgs grafiks",
    spots: 15,
    isOnline: true,
  },
  {
    id: "6",
    title: "Pasākumu organizatora palīgs",
    organization: "Latvijas Kultūras fonds",
    location: "Rīga",
    category: "Kultūra",
    description: "Palīdzība kultūras pasākumu organizēšanā - apmeklētāju sagaidīšana, informācijas sniegšana, vispārēja koordinācija.",
    timeCommitment: "Pasākumu laikā",
    spots: 20,
  },
  {
    id: "7",
    title: "Tulkotājs ukraiņu bēgļiem",
    organization: "Gribu palīdzēt bēgļiem",
    location: "Rīga",
    category: "Sociālais darbs",
    description: "Nepieciešami brīvprātīgie ar ukraiņu vai krievu valodas zināšanām, lai palīdzētu ar tulkošanu.",
    timeCommitment: "Pēc nepieciešamības",
    spots: 25,
    isUrgent: true,
  },
  {
    id: "8",
    title: "Mākslas darbnīcu vadīšana bērniem",
    organization: "Bērnu mākslas centrs",
    location: "Ventspils",
    category: "Kultūra",
    description: "Radošās darbnīcas vadīšana bērniem vecumā no 5-12 gadiem. Nepieciešama pieredze mākslā un darbā ar bērniem.",
    timeCommitment: "4h nedēļā",
    spots: 3,
    isNew: true,
  },
];

const categories = [
  "Visi",
  "Dzīvnieki",
  "Izglītība",
  "Vide",
  "Sociālais darbs",
  "IT",
  "Kultūra",
];

const cities = [
  "Visas pilsētas",
  "Rīga",
  "Jūrmala",
  "Liepāja",
  "Daugavpils",
  "Ventspils",
  "Jelgava",
  "Tiešsaiste",
];

const Listings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Visi");
  const [selectedCity, setSelectedCity] = useState("Visas pilsētas");
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "Visi" || listing.category === selectedCategory;
    
    const matchesCity =
      selectedCity === "Visas pilsētas" || listing.location === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const activeFiltersCount = [
    selectedCategory !== "Visi",
    selectedCity !== "Visas pilsētas",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("Visi");
    setSelectedCity("Visas pilsētas");
    setSearchQuery("");
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-secondary/50 py-12 md:py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Brīvprātīgā darba sludinājumi
            </h1>
            <p className="text-lg text-muted-foreground">
              Atrodi iespēju palīdzēt un iegūt jaunu pieredzi
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Meklēt pēc nosaukuma, organizācijas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggles */}
            <div className="flex gap-3">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px] h-12">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtri
                {activeFiltersCount > 0 && (
                  <Badge variant="accent" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="font-semibold text-foreground">Kategorijas</h3>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Notīrīt filtrus
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Atrasti <span className="font-semibold text-foreground">{filteredListings.length}</span> sludinājumi
            </p>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kārtot pēc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Jaunākie vispirms</SelectItem>
                <SelectItem value="urgent">Steidzamākie</SelectItem>
                <SelectItem value="spots">Vairāk vietu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Listings Grid */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nav atrasti sludinājumi
              </h3>
              <p className="text-muted-foreground mb-6">
                Mēģini mainīt meklēšanas kritērijus vai filtrus
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Notīrīt filtrus
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Listings;
