import stripe from "stripe"

import { createError } from "@/utils/helpers/error"
import { NextRequest, NextResponse } from "next/server.js"

const myStripe = new stripe(process.env.STRIPE_TEST_SECRET_KEY!)

export async function POST(req: NextRequest) {

    const { amount, currency } = await req.json()
    try {
        const paymentIntent = await myStripe.paymentIntents.create({
            amount: amount,
            currency: currency || "usd"
        })
        return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 })
    } catch (error: any) {

        return NextResponse.json(createError(500, error.raw.message))
    }

}