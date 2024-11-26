"use client";
import React from 'react'
import { RecoilRoot } from 'recoil'
import ClientLayout from './ClientLayout';

function RecoilWrapper({children}) {
  return (
    <RecoilRoot>
        <ClientLayout>{children}</ClientLayout>
    </RecoilRoot>
  )
}

export default RecoilWrapper
