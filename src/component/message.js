import React from 'react';

export default function Message({ t, useremail }) {
    const [hover, sethover] = React.useState(false);
    return (
        <li className={`overflow-hidden`}>
            <div className={`min-w-[10%] shadow-[0_2px_1px_#00000033] text-[10px] p-[20px] relative rounded-[5px] ${useremail === t.email ? 'float-left bg-[#ebebeb] m-[10px_0_3px_10px]' : 'float-right bg-[#dcf8c6] m-[10px_10px_3px_0]'}`} onMouseEnter={() => { sethover(true) }} onMouseLeave={() => { sethover(false) }}>
                <i className={`bubble-arrow absolute top-0 after:content-[""] after:absolute after:border-t-[15px] after:border-l-[15px] after:border-l-[transparent] after:rounded-[4px_0_0_0] after:w-0 after:h-0 ${useremail === t.email ? 'left-[-11px] after:border-t-[#ebebeb]' : 'right-[4px] after:border-t-[#dcf8c6] after:scale-x-[-1]'}`}></i>
                <div className={`absolute flex justify-between w-full top-0 left-0 p-[5px]`}>
                    <span className={`${useremail === t.email ? 'text-[#3498db]' : 'text-[#2ecc51]'}`}>{t.name}</span>
                    <i className={`tkd2-chevron-down3 text-tkd2 text-[16px] ${hover ? 'opacity-100' : 'opacity-0'}`}></i>
                </div>
                <span className="text-[14px] text-[#2b2b2b] m-auto table">{t.message}</span>
                <div className={`absolute flex justify-end items-center w-full bottom-0 left-0 p-[5px] gap-2`}>
                    <i className={`${t.star ? "tkd6-beveled-star text-tkd1" : "d-none"}`}></i>
                    <span className={`text-[#999] uppercase`}>{t.time}</span>
                </div>
            </div>
        </li>
    )
}
