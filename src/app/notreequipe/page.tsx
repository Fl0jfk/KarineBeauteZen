import PersonalList from "../components/List/PersonalList"

export default function NotreEquipe(){
    return (
        <main className="sm:pt-[10vh] md:pt-[10vh] flex flex-col items-center gap-8 p-4">
            <h1 className="text-6xl">Notre Équipe</h1>
            <PersonalList/>
        </main>
    )
}