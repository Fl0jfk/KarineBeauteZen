import FormContact from "../components/Forms/FormContact"

export default function Contact (){
    return (
        <main className="pt-[5vh]">
            <section id="contact" className="p-4 flex flex-col items-center justify-center gap-10 w-full mx-auto max-w-[600px]">
                <h1 className='text-7xl text-center'>Contact</h1>
                <div className="flex items-center w-full justify-center">
                    <p>Vous pouvez nous joindre directement en remplissant le formulaire. Nous vous répondrons le plus rapidement possible.</p>
                </div>
                <div className="flex flex-col gap-4 p-6 w-full">
                    <div className="flex gap-10 justify-center items-center">
                        <FormContact/>
                    </div>
                </div> 
            </section>
        </main>
    )
}