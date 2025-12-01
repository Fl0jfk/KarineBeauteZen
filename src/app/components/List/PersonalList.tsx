"use client"

import { useData } from "@/app/contexts/data"
import Image from "next/image"

export default function PersonalList (){
    const { team } = useData()
    return (
        <section>
            <div className="grid grid-cols-2 grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {team.map((member) => (
                    <div key={member.id} className="p-4 bg-white rounded-xl text-center">
                        <div className="mb-4">
                            {member.pp ? (
                                <Image src={member.pp} alt={`${member.firstname} ${member.lastname}`} className="w-24 h-24 rounded-full mx-auto"/>
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                                    <span className="text-2xl text-gray-500">?</span>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold">{member.firstname} {member.lastname}</h3>
                        <p className="text-gray-600 italic">{member.profession}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
